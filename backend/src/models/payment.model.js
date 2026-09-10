import razorpay from "razorpay";
import mongoose from "mongoose";

const paymentSchema=new mongoose.Schema(
    {
       user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
       },
       order:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
       },
       razorpayOrderId:{
        type:String,
        required:true
       },
       razorpayPaymentId:{
        type:String,
        default:""
       },
       razorpaySignature:{
        type:String,
        default:""
       },
       amount:{
        type:Number,
        required:true
       },
       status:{
        type:String,
        enum:["created","paid","pending"],
        default:"created"
       },
    },
    {
     timestamps:true,
    },

);

const Payment=mongoose.model("Payment",paymentSchema);
export default Payment;

