import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";
import ApiError from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";

export const addToWishlist=asynchandler(async(req,res)=>{
    const {productId} =req.params;

    const product=await Product.findById(productId);

    if(!product){
        throw new ApiError("Product not found",404);
    }

    const alreadyExists=await Wishlist.findOne({
        user:req.user._id,
        product:productId,
    })

    if(alreadyExists){
        throw new ApiError("Product already in wishlist",400);
    }

    const wishlist = await Wishlist.create({
        user: req.user._id,
        product: productId,
    });

    const populatedWishlist = await Wishlist.findById(wishlist._id)
    .populate("product");

    res.status(201).json({
        success:true,
        message:"Product added to wishlist",
        wishlist:populatedWishlist,
    })
})

export const getMyWishlist=asynchandler(async(req,res)=>{
    const wishlist=await Wishlist.find({
        user:req.user._id,
    }).populate("product");

    res.status(200).json({
        sucess:true,
        count:wishlist.length,
        wishlist,
    })
});

export const removeWishlist=asynchandler(async(req,res)=>{
    const wishlist=await Wishlist.findById(req.params.id);
    if(!wishlist){
        throw new ApiError("Wishlist items not found",404);
    }if(wishlist.user.toString() !== req.user._id.toString()){
        throw new ApiError("Unauthorized",403);
    }

    await wishlist.deleteOne();

    res.status(200).json({
        success:true,
        message:"Product removed from wishlist",
    })
})