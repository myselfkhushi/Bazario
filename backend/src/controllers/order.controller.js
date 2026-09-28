import Order from "../models/order.model.js";
import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import { createOrderFromCart } from "../services/order.service.js";


export const createorder=asynchandler( async(req,res)=>{
    const { shippingAddress } = req.body;
    const order=await createOrderFromCart(req.user._id, shippingAddress);

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

// 🟢 Live Order Tracking API (Customer Order ID ya AWB Number se track kar sake)
export const trackOrder = asynchandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError("Order ID or Tracking Number is required", 400);
    }

    // Check karein ki MongoDB ID hai ya Courier Tracking AWB Number
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
        query = { _id: id };
    } else {
        query = { trackingNumber: id.trim() };
    }

    const order = await Order.findOne(query)
        .populate("user", "name email")
        .select("_id orderstatus courier trackingNumber statusHistory totalamount shippingAddress createdAt orderitem");

    if (!order) {
        throw new ApiError("No shipment found for this Order ID or Tracking Number", 404);
    }

    res.status(200).json({
        success: true,
        order: {
            _id: order._id,
            orderstatus: order.orderstatus,
            courier: order.courier || "Express Surface Logistics",
            trackingNumber: order.trackingNumber || `TRK-${order._id.toString().slice(-8).toUpperCase()}`,
            createdAt: order.createdAt,
            shippingAddress: order.shippingAddress,
            totalamount: order.totalamount,
            statusHistory: order.statusHistory || [],
            orderitem: order.orderitem,
        },
    });
});