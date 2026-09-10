import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";

export const getSellerDashboard=asynchandler(async(req,res,next)=>{
    const sellerId=req.user._id;

    const totalProducts=await Product.countDocuments({
        createdBy:sellerId,
    })

    const products=await Product.find({createdBy:sellerId}).select("_id stock");
    const productIds=products.map((product)=>product._id);

    const totalOrders=await Order.countDocuments({
        "orderitem.product":{$in:productIds},
    });

    const orders=await Order.find({
        "orderitem.product":{$in:productIds},
    });

    let totalRevenue=0;

    orders.forEach((order)=>{
        totalRevenue+=order.totalamount;
    })

    const lowStockProducts=await Product.countDocuments({
        createdBy:sellerId,
        stock:{$lte:5},
    })

    const recentOrders=await Order.find({
        "orderitem.seller":sellerId,
    })
    .populate("user","name")
    .populate("orderitem.product", "title images price")
    .sort({createdAt:-1})
    .limit(5);

    res.status(200).json({
        success:true,
        dashboard:{
            totalProducts,
            totalOrders,
            totalRevenue,
            lowStockProducts,
            recentOrders
        },
    });

})

export const getRecentOrders=asynchandler(async(req,res)=>{
    const sellerId = req.user._id;
    const products=await Product.find({createdBy:sellerId}).select("_id");

    const productIds=products.map((p)=>p._id);

    const orders=await Order.find({
        "orderitem.product":{$in:productIds},
    })
    .populate("user","name email")
    .populate("orderitem.product", "title images price")
    .sort({createdAt:-1})
    .limit(5);

    res.status(200).json({
        success:true,
        orders,
    })
})

export const getSellerOrders = asynchandler(async (req, res) => {

    const sellerId = req.user._id;

    const products = await Product.find({
        createdBy: sellerId,
    }).select("_id");

    const productIds = products.map((p) => p._id);

    const orders = await Order.find({
        "orderitem.product": { $in: productIds },
    })
        .populate("user", "name email")
        .populate("orderitem.product", "title images price")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        orders,
    });

});