import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import Cart from "../models/cart.model.js";
import ApiError from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";
import crypto from "crypto";
import { createOrderFromCart } from "../services/order.service.js";


export const createPaymentOrder= asynchandler(async(req,res)=>{
    const { shippingAddress } = req.body;
    const cartItems= await Cart.find({
        user:req.user._id,
    }).populate("product");

    if(cartItems.length === 0){
        throw new ApiError("Cart is empty",403);
    }

    const totalAmount= cartItems.reduce((total,item)=>{
        return total+item.product.price*item.quantity;
    },0)

    const options={
        amount:totalAmount * 100,
        currency:"INR",
        receipt:`receipt_${Date.now()}`
    }

    const razorpayOrder=await razorpay.orders.create(options);

     const payment = await Payment.create({
        user: req.user._id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        status: "created",
        shippingAddress: shippingAddress || null,
    });

    res.status(200).json({
        success: true,
        razorpayOrder,
        payment,
        keyId: process.env.RAZORPAY_KEY_ID,
    });
});

export const verifyPayment=asynchandler(async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature, shippingAddress} = req.body;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
        throw new ApiError("All payment field is required",403);
    }

    if(!shippingAddress){
        throw new ApiError("Shipping address is required to complete order", 400);
    }

    const body= `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto.createHmac("sha256",process.env.RAZORPAY_KEY_SECRET).update(body).digest("hex");

    if(expectedSignature !== razorpay_signature){
      throw new ApiError("Invalid payment signature",403);
    }

    const payment= await Payment.findOne({
        razorpayOrderId:razorpay_order_id,
    })

    if(!payment){
        throw new ApiError("paymnet not found",400);
    }

    if(payment.user.toString() !== req.user._id.toString()){
        throw new ApiError("Unauthorized paymnet",400);
    }

    if(payment.status === "paid"){
        throw new ApiError("payment already verified",400);
    }

    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;

    const order = await createOrderFromCart(req.user._id, shippingAddress);
    payment.order=order._id;

    await payment.save();

    res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    payment,
    order,
  });
})

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