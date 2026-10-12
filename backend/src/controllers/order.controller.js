import Order from "../models/order.model.js";
import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import { createOrderFromCart } from "../services/order.service.js";


export const createorder=asynchandler( async(req,res)=>{
    const { shippingAddress } = req.body;

    if(!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode){
        throw new ApiError("Complete Shipping address is required ",400);
    }
    const order=await createOrderFromCart(req.user._id, shippingAddress);

    res.status(201).json({
        success:true,
        message:"order created successfully",
        order,
    })
});

export const getmyorder = asynchandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const [totalOrders, orders] = await Promise.all([
        Order.countDocuments({ user: req.user._id }),
        Order.find({ user: req.user._id })
            .populate({ path: "orderitem.product", select: "title price images" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
    ]);

    res.status(200).json({ 
        success: true,
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        orders,
     });
});
export const getsingleorder = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid Order ID format", 400);
    }
    const order = await Order.findById(id)
        .populate("user", "name email")
        .populate("orderitem.product")
        .lean();
    if (!order) {
        throw new ApiError("Order not found", 404); // Fixed: 404 instead of 403
    }
    // Security check: Only the buyer or an Admin can view this order
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
        throw new ApiError("You are not authorized to view this order", 403);
    }
    res.status(200).json({
        success: true,
        message: "Order fetched successfully", // Fixed typo: was "cart found"
        order,
    });
});

export const getallorder = asynchandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;
    const [totalOrders, orders] = await Promise.all([
        Order.countDocuments(),
        Order.find()
            .populate("user", "name email")
            .populate("orderitem.product", "title price")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
    ]);
    res.status(200).json({
        success: true,
        totalOrders,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        orders,
    });
});

export const updateorderstatus = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { orderstatus } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid Order ID format", 400);
    }
    const allowedStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];
    if (!orderstatus || !allowedStatuses.includes(orderstatus)) {
        throw new ApiError(`Invalid status. Allowed values: ${allowedStatuses.join(", ")}`, 400); // 400 Bad Request
    }
    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError("Order not found", 404); // 404 Not Found
    }
    // Update status and append to history tracking
    order.orderstatus = orderstatus;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
        status: orderstatus,
        updatedAt: new Date(),
    });
    await order.save();
    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order,
    });
});

export const gettotalrevenue = asynchandler(async (req, res) => {
    // Only calculate revenue for non-cancelled orders
    const result = await Order.aggregate([
        {
            $match: {
                orderstatus:"Delivered", // Cancelled orders ka paisa mat jodo
            },
        },
        {
            $group: {
                _id: null, // Saare orders ko ek sath group karo
                totalRevenue: { $sum: "$totalamount" }, // Database level par sum!
                totalOrdersCount: { $sum: 1 },
            },
        },
    ]);
    const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
    const totalOrdersCount = result.length > 0 ? result[0].totalOrdersCount : 0;
    res.status(200).json({
        success: true,
        message: "Total revenue calculated successfully",
        totalRevenue,
        totalOrdersCount,
    });
});
// 7. TRACK ORDER
export const trackOrder = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id?.trim()) {
        throw new ApiError("Order ID or Tracking Number is required", 400);
    }
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
        query = { _id: id };
    } else {
        query = { trackingNumber: id.trim() };
    }
    const order = await Order.findOne(query)
        .select("_id orderstatus courier trackingNumber statusHistory createdAt shippingAddress.city")
        .lean();
    if (!order) {
        throw new ApiError("No shipment found for this Order ID or Tracking Number", 404);
    }
    // Public tracking safe response (Personal data jaise phone/full address hide kiya)
    res.status(200).json({
        success: true,
        order: {
            _id: order._id,
            orderstatus: order.orderstatus,
            courier: order.courier || "Express Surface Logistics",
            trackingNumber: order.trackingNumber || `TRK-${order._id.toString().slice(-8).toUpperCase()}`,
            createdAt: order.createdAt,
            destinationCity: order.shippingAddress?.city,
            statusHistory: order.statusHistory || [],
        },
    });
});
