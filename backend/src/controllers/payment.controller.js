import razorpay from "../config/razorpay.js";
import Payment from "../models/payment.model.js";
import Cart from "../models/cart.model.js";
import ApiError from "../utils/apierror.js";
import asynchandler from "../utils/asynchandler.js";
import crypto from "crypto";
import { createOrderFromCart } from "../services/order.service.js";


export const createPaymentOrder= asynchandler(async(req,res)=>{
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

    const payment=await Payment.create({
        user:req.user._id,
        razorpayOrderId:razorpayOrder.id,
        amount:totalAmount,
        status:"created"
    })

    res.status(200).json({
    success: true,
    razorpayOrder,
    payment,
    });
});

export const verifyPayment=asynchandler(async(req,res)=>{
    const {razorpay_order_id,razorpay_payment_id,razorpay_signature} = req.body;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature){
        throw new ApiError("All payment field is required",403);
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

    const order = await createOrderFromCart(req.user._id);
    payment.order=order._id;

    await payment.save();

    res.status(200).json({
    success: true,
    message: "Payment verified successfully",
    payment,
    order,
  });
})