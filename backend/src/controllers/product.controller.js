import mongoose from "mongoose";

// Helper to escape regex special characters
const escapeRegex = (text = "") => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const getallproducts = asynchandler(async (req, res) => {
    const { search, category, brand, minPrice, maxPrice, sort } = req.query;

    const andConditions = [];

    // 1. Search (escaped to prevent regex injection / syntax errors)
    if (search && search.trim()) {
        const escapedSearch = escapeRegex(search.trim());
        andConditions.push({
            $or: [
                { title: { $regex: escapedSearch, $options: "i" } },
                { description: { $regex: escapedSearch, $options: "i" } },
                { brand: { $regex: escapedSearch, $options: "i" } },
                { category: { $regex: escapedSearch, $options: "i" } }
            ]
        });
    }

    // 2. Category
    if (category && category !== "All") {
        const trimmedCat = category.trim();
        if (trimmedCat.toLowerCase() === "home" || trimmedCat.toLowerCase() === "home & living") {
            andConditions.push({ category: { $in: [/^home$/i, /^home & living$/i] } });
        } else {
            andConditions.push({
                category: { $regex: new RegExp(`^${escapeRegex(trimmedCat)}$`, "i") }
            });
        }
    }

    // 3. Brand
    if (brand && brand !== "All") {
        const brands = brand.split(",").map(b => b.trim()).filter(Boolean);
        if (brands.length > 0) {
            const brandRegexes = brands.map(b => new RegExp(`^${escapeRegex(b)}$`, "i"));
            const titleWordRegexes = brands.map(
                b => new RegExp(`(^|[^a-zA-Z0-9])${escapeRegex(b)}([^a-zA-Z0-9]|$)`, "i")
            );

            andConditions.push({
                $or: [
                    { brand: { $in: brandRegexes } },
                    { title: { $in: titleWordRegexes } }
                ]
            });
        }
    }

    // 4. Price range (with NaN checks)
    const min = Number(minPrice);
    const max = Number(maxPrice);
    if (!Number.isNaN(min) || !Number.isNaN(max)) {
        const priceQuery = {};
        if (!Number.isNaN(min)) priceQuery.$gte = min;
        if (!Number.isNaN(max)) priceQuery.$lte = max;
        andConditions.push({ price: priceQuery });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    // 5. Sorting logic
    let sortObj = { createdAt: -1 }; // default to newest
    switch (sort) {
        case "price_asc":
            sortObj = { price: 1 };
            break;
        case "price_desc":
            sortObj = { price: -1 };
            break;
        case "brand_asc":
            sortObj = { brand: 1, title: 1 };
            break;
        case "brand_desc":
            sortObj = { brand: -1, title: 1 };
            break;
        case "newest":
            sortObj = { createdAt: -1 };
            break;
        default:
            break;
    }

    // 6. Pagination boundaries
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12)); // Cap limit between 1 and 100
    const skip = (page - 1) * limit;

    // 7. Concurrent database execution
    const [totalProducts, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email")
            .lean() // Faster read-only query
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
        success: true,
        count: products.length,
        totalProducts,
        totalPages,
        currentPage: page,
        products, // Consistent plural naming
    });
});

export const getsingleproduct = asynchandler(async (req, res) => {
    const { id } = req.params;

    // Prevent CastError on malformed IDs
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid product ID format", 400);
    }

    const product = await Product.findById(id)
        .populate("createdBy", "name email")
        .lean();

    if (!product) {
        throw new ApiError("Product not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Product found successfully",
        product,
    });
});