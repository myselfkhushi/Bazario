import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import Cart from "../models/cart.model.js";
import ApiError from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";
import crypto from "crypto";
import { createOrderFromCart } from "../services/order.service.js";


export const createPaymentOrder= asynchandler(async(req,res)=>{
    const { shippingAddress } = req.body;

     if(!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode
     )
     throw new ApiError("Complete shipping address is required before payment",400);
     
     const cartItems= await Cart.find({
        user:req.user._id,
    }).populate("product");

    if(!cartItems || cartItems.length === 0){
        throw new ApiError("Cart is empty",400);
    }
 let totalAmount = 0;
    for (const item of cartItems) {
        if (!item.product) {
            throw new ApiError("Some products in your cart no longer exist. Please update cart.", 400);
        }
        if (item.quantity > item.product.stock) {
            throw new ApiError(
                `Product "${item.product.title}" is out of stock. Available: ${item.product.stock}`,
                400
            );
        }
        totalAmount += item.product.price * item.quantity;
    }
    // Convert to Paise with Math.round to avoid JS floating point bugs
    const amountInPaise = Math.round(totalAmount * 100);
    const options = {
        amount: amountInPaise,
        currency: "INR",
        receipt: `rcpt_${Date.now()}_${req.user._id.toString().slice(-4)}`,
    };
    const razorpayOrder = await razorpay.orders.create(options);
    const payment = await Payment.create({
        user: req.user._id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        status: "created",
        shippingAddress,
    });
    res.status(200).json({
        success: true,
        razorpayOrder,
        paymentId: payment._id,
        keyId: process.env.RAZORPAY_KEY_ID,
    });
});
export const verifyPayment = asynchandler(async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, shippingAddress } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        throw new ApiError("All payment verification fields are required", 400);
    }
    // 🛑 Signature Verification
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");
    if (expectedSignature !== razorpay_signature) {
        throw new ApiError("Invalid payment signature. Payment verification failed.", 400);
    }
    // 🛑 Atomic State Lock to prevent Race Conditions (Double Order Creation)
    // Sirf wahi document update hoga jo abhi tak 'paid' nahi hua hai!
    const payment = await Payment.findOneAndUpdate(
        {
            razorpayOrderId: razorpay_order_id,
            user: req.user._id,
            status: { $ne: "paid" }, // Agar already paid ho chuka hai (webhook dwara), toh ye null dega!
        },
        {
            $set: {
                status: "paid",
                razorpayPaymentId: razorpay_payment_id,
                razorpaySignature: razorpay_signature,
            },
        },
        { new: true }
    );
    // Agar payment already 'paid' ho chuka hai (Webhook ne order bana diya)
    if (!payment) {
        const existingPayment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });
        if (existingPayment && existingPayment.status === "paid") {
            return res.status(200).json({
                success: true,
                message: "Payment already verified and order created",
                orderId: existingPayment.order,
            });
        }
        throw new ApiError("Payment record not found or unauthorized", 404);
    }
    // Create Order from Cart
    const finalAddress = shippingAddress || payment.shippingAddress;
    const order = await createOrderFromCart(req.user._id, finalAddress);
    payment.order = order._id;
    await payment.save();
    res.status(200).json({
        success: true,
        message: "Payment verified successfully and order placed",
        order,
        payment,
    });
});

// 🟢 Production Webhook: Direct from Razorpay Server
export const razorpayWebhook = asynchandler(async (req, res) => {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "bazario_webhook_secret_key_123";
    const signature = req.headers["x-razorpay-signature"];

    if (!signature) {
        throw new ApiError("Webhook signature missing", 400);
    }

    // 1. Signature Verify Karna (Security check ki call sach me Razorpay se aayi hai)
    const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (expectedSignature !== signature) {
        throw new ApiError("Invalid webhook signature", 400);
    }

    const event = req.body.event;

    // 2. Agar payment complete ho gayi hai
    if (event === "payment.captured" || event === "order.paid") {
        const paymentEntity = req.body.payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        const razorpayPaymentId = paymentEntity.id;

        const payment = await Payment.findOne({ razorpayOrderId });

        // Idempotency: Agar order pehle nahi bana tha, toh banao!
        if (payment && payment.status !== "paid") {
            payment.status = "paid";
            payment.razorpayPaymentId = razorpayPaymentId;
            payment.razorpaySignature = signature;

            if (!payment.order && payment.shippingAddress) {
                const order = await createOrderFromCart(payment.user, payment.shippingAddress);
                payment.order = order._id;
            }

            await payment.save();
        }
    }

    // Razorpay ko batayein ki alert successfully mil gaya
    res.status(200).json({ status: "ok" });
});