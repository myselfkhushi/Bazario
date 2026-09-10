import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js"
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";

export const createReview =asynchandler(async(req,res)=>{
    const {rating ,comment} = req.body;
    const {productId} = req.params;

    const product=await Product.findById(productId);
    if(!product){
        throw new ApiError("Product not found",404);
    }

        const purchasedProduct = await Order.findOne({
            user: req.user._id,
            orderstatus: "delivered",
            "orderitem.product": productId
        });

    if(!purchasedProduct){
        throw new ApiError(
            "You can review only products you have purchased",
            403
        );
    }

    const alreadyReviewed=await Review.findOne({
        user:req.user._id,
        product:productId,
    });

    if(alreadyReviewed){
        throw new ApiError("you Already reviewd this product",400);
    }

    const review=await Review.create({
        user:req.user._id,
        product:productId,
        rating,
        comment,
    })
await product.updateRating();

    res.status(201).json({
        success: true,
        message: "Review added successfully",
        review,
    });
})

export const getProductReviews=asynchandler(async(req,res)=>{
    const {productId}=req.params;

    const reviews=await Review.find({
        product:productId,
    }).populate("user","name")
    .sort({createdAt:-1});

    res.status(200).json({
        success:true,
        count:reviews.length,
        reviews,
    })
})

export const updateReview =asynchandler(async(req,res)=>{
    const {rating,comment} =req.body;
    
    const review =await Review.findById(req.params.reviewId);
    if(!review){
        throw new  ApiError("Review not found",404);
    }
    if(review.user.toString() !== req.user._id.toString()){
        throw new ApiError("Unauthorizwed",403);
    }

    review.rating =rating;
    review.comment=comment;

    await review.save();

    const product=await Product.findById(review.product);
    await product.updateRating();
    res.status(200).json({
        success:true,
        message:"Review Updated Successfully",
        review,
    })

})

export const deleteReview=asynchandler(async(req,res)=>{
    const review=await Review.findById(req.params.reviewId);
    if(!review){
        throw new ApiError("Review not found",404);
    }

    if(review.user.toString() !== req.user._id.toString()){
        throw new ApiError("Unauthorized",403);
    }

    const product=await Product.findById(review.product);
    await review.deleteOne();

    await product.updateRating();

    res.status(200).json({
        sucess:true,
        message:"Review Deleted Successfully",
    })
})