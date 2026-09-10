import Cart from "../models/cart.model.js"
import ApiError from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";
import Product from "../models/product.model.js";

export const addtocart =asynchandler( async (req,res)=>{
    
        const {product,quantity} = req.body;

        if(!product || !quantity){
            throw new ApiError("product and quantity is required",400);
        }

        if(quantity <= 0){
            throw new ApiError("quantity never be negative",400);
        }

        
        const existingcartitem=await Cart.findOne({
            user:req.user._id,
            product,
        })

        const productData = await Product.findById(product);

        if(!productData){
           throw new ApiError("product not present in database",400);
        }

        if(existingcartitem){
            if(existingcartitem.quantity + quantity > productData.stock){
                throw new ApiError("product is out of stock",400);
            }
            
            existingcartitem.quantity+=quantity;

            await existingcartitem.save();
            await cartitem.populate("product");

            return res.status(200).json({
                success:true,
                message:"product cart updated successfully",
                cartitem:existingcartitem,
            })

        }


        if(productData.stock < quantity){
            throw new ApiError("product is out of stock",400);
        }

        const cartitem= await Cart.create({
            user:req.user._id,
            product,
            quantity,
        });
        await cartitem.populate("product");

        res.status(201).json({
            success:true,
            message:"product added to cart",
            cartitem,
        })
   
})

export const getmycart= asynchandler(async (req,res)=>{
   
        const cartitem=await Cart.find({
            user:req.user._id
        })
        .populate("product")
        .populate("user","name email")

         res.status(200).json({
            success:true,
            count:cartitem.length,
            cart:cartitem
         })
})

export const updatecart= asynchandler(async(req,res)=>{

     const { quantity } = req.body;

    if (quantity === undefined) {
        throw new ApiError("Quantity is required", 400);
    }

    if ( quantity <= 0) {
        throw new ApiError("Quantity must be greater than 0", 400);
    }
    
        const cartitem = await Cart.findById(req.params.id);

        console.log("cartitem",cartitem);


        if(!cartitem){
            throw new ApiError("cart  not found",404);
        }


        if(cartitem.user.toString() !== req.user._id.toString()){
           throw new ApiError("unauthorize user",403);
        }

    const productData = await Product.findById(cartitem.product);

    if (!productData) {
        throw new ApiError("Product not found", 404);
    }

    if (quantity > productData.stock) {
        throw new ApiError("Requested quantity exceeds available stock", 400);
    }

    cartitem.quantity = quantity;

    await cartitem.save();
    await cartitem.populate("product");

        res.status(200).json({
            success:true,
            message:"product updated successfully",
            cartitem,
        })
    
})

export const removecartitem =asynchandler( async(req,res)=>{
    
        const cartitem=await Cart.findById(req.params.id);

        if(!cartitem){
            throw new ApiError("cart item not found",404);
        }

        if(cartitem.user.toString() !== req.user._id.toString()){
            throw new ApiError("unauthorize user",403);
        }

        await cartitem.deleteOne();

        res.status(200).json({
            success:true,
            message:"cart item deleted successfully"
        })
    
})

