import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import { createOrderFromCart } from "../services/order.service.js";


export const createorder=asynchandler( async(req,res)=>{
    const order=await createOrderFromCart(req.user._id);

    res.status(200).json({
        success:true,
        message:"order created successfully",
        order,
    })
    
    
});

export const getmyorder = asynchandler(async (req, res) => {

    const order = await Order.find({
        user: req.user._id,
    })
        .populate("user", "name email")
        .populate({
            path: "orderitem.product",
        });

    console.log(
        JSON.stringify(order, null, 2)
    );

    res.status(200).json({
        success: true,
        count: order.length,
        order,
    });
});
export const getsingleorder= asynchandler( async(req,res)=>{
    
        const order=await Order.findById(req.params.id)
        .populate("user","name email -password")
        .populate("orderitem.product")
        
        if(!order){
           throw new ApiError("order not found",403)
        }
        
        
        if(order.user._id.toString() !== req.user._id.toString()){
            throw new ApiError("unauthorized user",403);
        }

        res.status(200).json({
            success:true,
            message:"cart found",
            order,
        })
});

export const getallorder=asynchandler( async(req,res)=>{
    
        const order=await Order.find()
        .populate("user","name email -password")
        .populate("orderitem.product");

        // console.log(order.user._id);
        // console.log(req.user._id);

        // if(order.user._id.toString() !== req.user._id.toString()){
        //     throw new ApiError("unauthorized user",403);
        // }
         
        res.status(200).json({
            success:true,
            count:order.length,
            order,
        })
});

export const updateorderstatus = asynchandler(async(req,res)=>{
    
        const order =await Order.findById(req.params.id);

        if(!order){
            throw new ApiError("order not found",403);
        }

        const { orderstatus } = req.body;

if (!orderstatus) {
    throw new ApiError("Order status is required",403);
}

       order.orderstatus = orderstatus;

        await order.save();

        res.status(200).json({
            success:true,
            message:"update order status sucessfully",
            order,
        })
    
});

export const gettotalrevenue = asynchandler(async (req,res)=>{
    
        const orders=await Order.find();
        const totalrevenue= orders.reduce((acc,order) => acc+order.totalamount,0);
        res.status(200).json({
            success:true,
            message:"total revenue from orders",
            totalrevenue,
        })
    
});