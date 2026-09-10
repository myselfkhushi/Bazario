import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
// import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js"
import orderRoutes from "./routes/order.routes.js"
import errmiddleware from "./middleware/error.middleware.js";
import SellerRoutes from "./routes/seller.routes.js";
import paymentRoutes from "./routes/payment.routes.js"
import reviewRoutes from "./routes/review.routes.js"
import wishlistRoutes from "./routes/wishlist.routes.js";
// // dotenv.config();
const app=express();

app.use(express.json());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
}));
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/",(req,res)=>{
    res.send("hello world")
});


app.use("/api/auth",authRoutes);
app.use("/api/products",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/seller",SellerRoutes);
app.use("/api/reviews",reviewRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use(errmiddleware);




app.get("/home",(req,res)=>{
    res.send("at home page")
});

export default app;