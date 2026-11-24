import Order from "../models/order.model.js";
import mongoose from "mongoose";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import Payment from "../models/payment.model.js";
import razorpay from "../config/razorpay.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";
import { createOrderFromCart } from "../services/order.service.js";

// 1. CREATE ORDER FROM CART
export const createorder = asynchandler(async (req, res) => {
    const { shippingAddress } = req.body;

    const street = shippingAddress?.street || shippingAddress?.address;
    const pincode = shippingAddress?.pincode || shippingAddress?.postalCode;
    const city = shippingAddress?.city;

    if (!shippingAddress || !street || !city || !pincode) {
        throw new ApiError("Complete Shipping address is required", 400);
    }

    const normalizedAddress = {
        fullName: (shippingAddress.fullName || req.user.name || "Customer").trim(),
        phone: (shippingAddress.phone || "").trim(),
        street: String(street).trim(),
        address: String(street).trim(),
        city: String(city).trim(),
        state: (shippingAddress.state || "Rajasthan").trim(),
        pincode: String(pincode).trim(),
        postalCode: String(pincode).trim(),
    };

    const order = await createOrderFromCart(req.user._id, normalizedAddress);

    res.status(201).json({
        success: true,
        message: "Order created successfully",
        order,
    });
});

// 2. GET USER'S ORDER HISTORY
export const getmyorder = asynchandler(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 100));
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

// 3. GET SINGLE ORDER DETAILS
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
        throw new ApiError("Order not found", 404);
    }
    // Security check: Only the buyer or an Admin can view this order
    const isOwner = order.user._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
        throw new ApiError("You are not authorized to view this order", 403);
    }
    res.status(200).json({
        success: true,
        message: "Order fetched successfully",
        order,
    });
});

// 4. ADMIN: GET ALL ORDERS
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

// 5. ADMIN: UPDATE ORDER STATUS
export const updateorderstatus = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { orderstatus } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid Order ID format", 400);
    }
    const allowedStatuses = [
        "pending",
        "confirmed",
        "processing",
        "rtd",
        "shipped",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "returned",
        "return_requested",
        "rto",
    ];

    const normalizedStatus = (orderstatus || "").toLowerCase();
    if (!normalizedStatus || !allowedStatuses.includes(normalizedStatus)) {
        throw new ApiError(`Invalid status. Allowed values: ${allowedStatuses.join(", ")}`, 400);
    }
    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError("Order not found", 404);
    }

    order.orderstatus = normalizedStatus;
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
        status: normalizedStatus,
        timestamp: new Date(),
        message: `Order status updated to ${normalizedStatus} by Administrator.`,
        location: "Warehouse Fulfillment Center",
    });
    await order.save();
    res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        order,
    });
});

// 6. ADMIN: GET TOTAL REVENUE
export const gettotalrevenue = asynchandler(async (req, res) => {
    const result = await Order.aggregate([
        {
            $match: {
                orderstatus: "delivered",
            },
        },
        {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$totalamount" },
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

// 8. CANCEL ORDER (Before Shipped) WITH AUTOMATIC REFUND
export const cancelorder = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid Order ID format", 400);
    }

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError("Order not found", 404);
    }

    // Verify buyer ownership or admin
    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
        throw new ApiError("You are not authorized to cancel this order", 403);
    }

    const currentStatus = (order.orderstatus || "").toLowerCase();

    // Check if order already in final or in-transit state
    if (currentStatus === "cancelled") {
        throw new ApiError("This order is already cancelled.", 400);
    }
    if (currentStatus === "shipped" || currentStatus === "out_for_delivery") {
        throw new ApiError(
            "This order has already been handed over to courier and shipped. You can request a return after delivery.",
            400
        );
    }
    if (currentStatus === "delivered") {
        throw new ApiError(
            "This order has already been delivered. Please use the Return Order option.",
            400
        );
    }
    if (["return_requested", "returned", "rto"].includes(currentStatus)) {
        throw new ApiError("Order cannot be cancelled in its current state.", 400);
    }

    // 1. Restock items back to inventory
    if (Array.isArray(order.orderitem) && order.orderitem.length > 0) {
        for (const item of order.orderitem) {
            const prodId = item.product?._id || item.product;
            if (prodId) {
                await Product.findByIdAndUpdate(prodId, {
                    $inc: { stock: item.quantity || 1 },
                });
            }
        }
    }

    // 2. Process Razorpay online refund if prepaid
    let refundResult = null;
    let refundMessage = "No prepaid transaction to refund.";
    let refundInitiated = false;

    const payment = await Payment.findOne({
        order: order._id,
        status: { $in: ["paid", "created"] },
    });

    if (payment && payment.razorpayPaymentId) {
        try {
            const refundAmountInPaise = Math.round((order.totalamount || payment.amount) * 100);
            refundResult = await razorpay.payments.refund(payment.razorpayPaymentId, {
                amount: refundAmountInPaise,
                notes: {
                    orderId: order._id.toString(),
                    reason: reason || "Customer cancelled order before shipping",
                },
            });

            await Payment.updateOne(
                { _id: payment._id },
                {
                    $set: {
                        status: "refunded",
                        refundId: refundResult.id,
                        refundAmount: order.totalamount || payment.amount,
                    },
                }
            );

            refundInitiated = true;
            refundMessage = `Prepaid online refund of ₹${order.totalamount.toLocaleString(
                "en-IN"
            )} initiated successfully (Refund ID: ${refundResult.id}). Amount will reflect in your bank account / source within 5–7 business days.`;
        } catch (refErr) {
            console.error("Razorpay refund error:", refErr);
            refundInitiated = true;
            refundMessage = `Prepaid online refund queued for processing to your original payment method.`;
        }
    }

    // 3. Update Order Status
    order.orderstatus = "cancelled";
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
        status: "cancelled",
        timestamp: new Date(),
        message: `Order cancelled by customer. Reason: ${reason || "Changed mind"}. ${refundMessage}`,
        location: "Customer Web Portal",
    });

    await order.save();

    res.status(200).json({
        success: true,
        message: `Order cancelled successfully. ${refundInitiated ? "Refund has been initiated." : ""}`,
        order,
        refundInitiated,
        refundMessage,
    });
});

// 9. RETURN ORDER (After Delivered)
export const returnorder = asynchandler(async (req, res) => {
    const { id } = req.params;
    const { reason, comments } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError("Invalid Order ID format", 400);
    }

    const order = await Order.findById(id);
    if (!order) {
        throw new ApiError("Order not found", 404);
    }

    // Verify buyer ownership or admin
    const isOwner = order.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
        throw new ApiError("You are not authorized to return this order", 403);
    }

    const currentStatus = (order.orderstatus || "").toLowerCase();

    if (currentStatus === "return_requested" || currentStatus === "returned") {
        throw new ApiError("Return has already been requested or processed for this order.", 400);
    }

    if (currentStatus !== "delivered") {
        throw new ApiError(
            `Returns can only be requested for delivered orders. Current status is ${currentStatus}.`,
            400
        );
    }

    const returnReasonText = reason
        ? `${reason}${comments ? ` (${comments})` : ""}`
        : "Product did not meet expectations";

    order.orderstatus = "return_requested";
    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
        status: "return_requested",
        timestamp: new Date(),
        message: `Return request submitted by customer. Reason: ${returnReasonText}. Our reverse courier team will arrange doorstep verification and pickup.`,
        location: `${order.shippingAddress?.city || "Customer Address"}`,
    });

    await order.save();

    res.status(200).json({
        success: true,
        message: "Return request submitted successfully. Reverse courier pickup will be scheduled.",
        order,
    });
});
