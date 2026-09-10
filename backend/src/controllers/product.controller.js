import Product from "../models/product.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
// import {cloudinary} from "../config/cloudinary.js"
import uploadtocloudinary from "../utils/uploadtocloudinary.js";

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
        throw new ApiError("image is required", 404);
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

    const Products = await Product.create({
        title,
        description,
        price: Number(price),
        mrp: mrp ? Number(mrp) : Math.round(Number(price) * 1.25),
        stock: Number(stock),
        category,
        brand: brand || "Bazario Official",
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

    res.status(200).json({
        success: true,
        message: "Product created successfully",
        product: Products,
    });
});

export const getallproducts = asynchandler(async (req, res) => {
    const { search, category, brand, minPrice, maxPrice, sort } = req.query;

    let query = {};

    // 1. Search
    if (search) {
        query.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } }
        ];
    }

    // 2. Category
    if (category && category !== "All") {
        query.category = category;
    }

    // 3. Brand
    if (brand && brand !== "All") {
        const brands = brand.split(",").map(b => b.trim());
        query.brand = { $in: brands };
    }

    // 4. Price range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 5. Sorting logic
    let sortObj = { createdAt: -1 }; // default to newest
    if (sort) {
        switch (sort) {
            case "price_asc":
                sortObj = { price: 1 };
                break;
            case "price_desc":
                sortObj = { price: -1 };
                break;
            case "newest":
                sortObj = { createdAt: -1 };
                break;
            default:
                break;
        }
    }

    const products = await Product.find(query)
        .sort(sortObj)
        .populate("createdBy", "name email");

    res.status(200).json({
        success: true,
        count: products.length,
        product: products,
    });
});

export const getsingleproduct = asynchandler(async (req, res) => {
    const products = await Product.findById(req.params.id).populate(
        "createdBy",
        "name email"
    );

    if (!products) {
        throw new ApiError("product not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "product found successfully",
        product: products,
    });
});

export const updateproduct = asynchandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new ApiError("product not found", 404);
    }

    if (req.user.role !== "admin" && product.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("Unauthorized user", 403);
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

export const deleteproduct=asynchandler( async (req,res)=>{
    
        const product=await Product.findById(req.params.id);

        if(!product){
           throw new ApiError("product not found",404);
        }

        if (product.createdBy.toString() !== req.user._id.toString()) {
        throw new ApiError("Unauthorized user",403);
}
        await product.deleteOne();
       cloudinary.uploader.destroy(product.imagepublicid);

        res.status(200).json({
            success:true,
            message:"product deleted"
        })
})

export const getproductwithsearch =asynchandler( async (req,res)=>{
   
        const keyword=req.query.keyword || "";
      
        const product =await Product.find({
            title:{
                $regex:keyword,
                $options:"i",
            },
        })

        res.status(200).json({
            success:true,
            count:product.length,
            product
        })
    
       
})

export const getproductwithpagination= asynchandler(async(req,res)=>{
        const page=Number(req.query.page) || 1;
        const limit=2;
        const skip=(page-1)*limit;

        const product =await Product.find().skip(skip).limit(limit);
        const totalproducts= await Product.countDocuments();

        res.status(200).json({
            success:true,
            currentpage:page,
            totalpage:Math.ceil(totalproducts/limit),
            totalproducts,
            product,
        })

    
})

export const getproductwithcategory=asynchandler(async(req,res)=>{
    
        const product=await Product.find({

            category:req.params.category
        })

        res.status(200).json({
            success:true,
            count:product.length,
            product,
        })
   
})

export const getmyproduct= asynchandler( async(req,res)=>{
   
        const products =await Product.find({
            createdBy:req.user._id,
        })

        console.log(req.user);

        res.status(200).json({
            success:true,
            count:products.length,
            product:products,
        })
   
})

export const getproductcount =asynchandler( async(req,res)=>{
  
    const count =await Product.countDocuments();

    res.status(200).json({
        success:true,
        count,
    })
  
  
});