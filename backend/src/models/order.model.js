import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({

   user:{
    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:"User"
   },

   orderitem:[
    {
      product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
      },
      
      seller:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
   
     quantity:{
        type:Number,
        required:true
     },
     
     price:{
        type:Number,
        required:true
     }
   },
],
   shippingAddress: {
     fullName: { type: String, required: true },
     phone: { type: String, required: true },
     street: { type: String, required: true },
     city: { type: String, required: true },
     state: { type: String, required: true },
     pincode: { type: String, required: true },
   },
   totalamount:{
    type:Number,
    required:true
   },
   orderstatus:{
       type:String,
       enum:["pending","processing","shipped","delivered"],

       default:"pending",
   }

},
{
    timestamps:true
});

const Order=mongoose.model("Order",orderSchema);
export default Order;