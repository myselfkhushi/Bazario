import mongoose from "mongoose";
import Product from "../models/product.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import uploadtocloudinary from "../utils/uploadtocloudinary.js";
import cloudinary from "../config/cloudinary.js";

// Helper to escape regex special characters
const escapeRegex = (text = "") => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const createProduct = asynchandler(async (req, res) => {
    const {
        title,
        description,
        price,
        mrp,
        stock,
        category,
        brand,
        warranty,
        returnPolicy,
        color,
        size,
        weight,
        highlights,
        specifications
    } = req.body;

    if (!req.files || req.files.length === 0) {
        throw new ApiError("At least one product image is required", 400);
    }

    const images = [];
    for (const file of req.files) {
        const uploadImage = await uploadtocloudinary(file.buffer);
        images.push({
            public_id: uploadImage.public_id,
            url: uploadImage.secure_url,
        });
    }

    let parsedHighlights = [];
    if (highlights) {
        if (Array.isArray(highlights)) {
            parsedHighlights = highlights;
        } else if (typeof highlights === "string") {
            try {
                parsedHighlights = JSON.parse(highlights);
            } catch {
                parsedHighlights = highlights.split("\n").map(h => h.trim()).filter(Boolean);
            }
        }
    }

    let parsedSpecs = [];
    if (specifications) {
        if (Array.isArray(specifications)) {
            parsedSpecs = specifications;
        } else if (typeof specifications === "string") {
            try {
                parsedSpecs = JSON.parse(specifications);
            } catch {
                parsedSpecs = [];
            }
        }
    }

    const newProduct = await Product.create({
        title: title?.trim(),
        description: description?.trim(),
        price: Number(price),
        mrp: mrp ? Number(mrp) : Math.round(Number(price) * 1.25),
        stock: Number(stock),
        category: category?.trim(),
        brand: brand?.trim() || "Bazario Official",
        warranty: warranty || "1 Year Brand Warranty",
        returnPolicy: returnPolicy || "7 Days Doorstep Replacement",
        color,
        size,
        weight,
        highlights: parsedHighlights,
        specifications: parsedSpecs,
        images,
        createdBy: req.user._id,
    });

    res.status(201).json({
        success: true,
        message: "Product created successfully",
        product: newProduct,
    });
});

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
    let sortObj = { createdAt: -1 };
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
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12));
    const skip = (page - 1) * limit;

    // 7. Concurrent database execution
    const [totalProducts, products] = await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit)
            .populate("createdBy", "name email")
            .lean()
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
        success: true,
        count: products.length,
        totalProducts,
        totalPages,
        currentPage: page,
        products,
    });
});

export const getsingleproduct = asynchandler(async (req, res) => {
    const { id } = req.params;

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

export const updateproduct = asynchandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError("Product not found", 404);
    }

    if (req.user.role !== "admin" && product.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("Unauthorized to update this product", 403);
    }

    const updateData = { ...req.body };

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.mrp) updateData.mrp = Number(updateData.mrp);
    if (updateData.stock) updateData.stock = Number(updateData.stock);

    if (updateData.highlights && typeof updateData.highlights === "string") {
        try {
            updateData.highlights = JSON.parse(updateData.highlights);
        } catch {
            updateData.highlights = updateData.highlights.split("\n").map(h => h.trim()).filter(Boolean);
        }
    }

    if (updateData.specifications && typeof updateData.specifications === "string") {
        try {
            updateData.specifications = JSON.parse(updateData.specifications);
        } catch {
            updateData.specifications = [];
        }
    }

    if (req.files && req.files.length > 0) {
        const images = [];
        for (const file of req.files) {
            const uploadImage = await uploadtocloudinary(file.buffer);
            images.push({
                public_id: uploadImage.public_id,
                url: uploadImage.secure_url,
            });
        }
        updateData.images = images;
    }

    const updated = await Product.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product: updated,
    });
});

export const deleteproduct = asynchandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError("Product not found", 404);
    }

    if (req.user.role !== "admin" && product.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("Unauthorized to delete this product", 403);
    }

    await product.deleteOne();

    if (product.images && product.images.length > 0) {
        for (const img of product.images) {
            if (img.public_id) {
                try {
                    await cloudinary.uploader.destroy(img.public_id);
                } catch (e) {
                    // ignore cloudinary delete error
                }
            }
        }
    }

    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
    });
});

export const getproductwithsearch = asynchandler(async (req, res) => {
    const keyword = req.query.keyword || "";
    const product = await Product.find({
        title: {
            $regex: escapeRegex(keyword),
            $options: "i",
        },
    });

    res.status(200).json({
        success: true,
        count: product.length,
        product,
    });
});

export const getproductwithpagination = asynchandler(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = 12;
    const skip = (page - 1) * limit;

    const product = await Product.find().skip(skip).limit(limit);
    const totalproducts = await Product.countDocuments();

    res.status(200).json({
        success: true,
        currentpage: page,
        totalpage: Math.ceil(totalproducts / limit),
        totalproducts,
        product,
    });
});

export const getproductwithcategory = asynchandler(async (req, res) => {
    const categoryParam = req.params.category ? req.params.category.trim() : "";
    let query = {};
    if (categoryParam.toLowerCase() === "home" || categoryParam.toLowerCase() === "home & living") {
        query.category = { $in: [/^home$/i, /^home & living$/i] };
    } else {
        query.category = { $regex: new RegExp(`^${escapeRegex(categoryParam)}$`, "i") };
    }

    const product = await Product.find(query);

    res.status(200).json({
        success: true,
        count: product.length,
        product,
    });
});

export const getproductbrands = asynchandler(async (req, res) => {
    const brands = await Product.distinct("brand");
    const validBrands = brands
        .filter(b => b && typeof b === "string" && b.trim().length > 0)
        .map(b => b.trim());

    const uniqueMap = new Map();
    for (const b of validBrands) {
        const lower = b.toLowerCase();
        if (!uniqueMap.has(lower)) {
            uniqueMap.set(lower, b);
        }
    }

    res.status(200).json({
        success: true,
        brands: Array.from(uniqueMap.values()),
    });
});

export const getmyproduct = asynchandler(async (req, res) => {
    const products = await Product.find({
        createdBy: req.user._id,
    });

    res.status(200).json({
        success: true,
        count: products.length,
        product: products,
    });
});

export const getproductcount = asynchandler(async (req, res) => {
    const count = await Product.countDocuments();

    res.status(200).json({
        success: true,
        count,
    });
});
