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

   const totalOrders = await Order.countDocuments({
        "orderitem.seller": sellerId,
    });
    const orders = await Order.find({
        "orderitem.seller": sellerId,
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
    // const products=await Product.find({createdBy:sellerId}).select("_id");

    // const productIds=products.map((p)=>p._id);

    const orders = await Order.find({
        "orderitem.seller": sellerId,
    })
    .populate("user","name email")
    .sort({createdAt:-1})
    .limit(5);

    res.status(200).json({
        success:true,
        orders,
    })
})

export const getSellerOrders = asynchandler(async (req, res) => {

    const sellerId = req.user._id;

    const orders = await Order.find({
        "orderitem.seller": sellerId,
    })
        .populate("user", "name email")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        orders,
    });

});

// 🟢 Seller Order Status Update (Strictly limited to Seller's scope)
export const updateSellerOrderStatus = asynchandler(async (req, res) => {
    const sellerId = req.user._id;
    const { orderId } = req.params;
    const { orderstatus, courier, trackingNumber, location, message } = req.body;

    // 🔒 Real-World Rule: Seller sirf shipped tak hi update kar sakta hai
    const allowedSellerStatuses = [
        "confirmed",
        "processing",
        "rtd",
        "shipped",
        "cancelled"
    ];

    if (!allowedSellerStatuses.includes(orderstatus)) {
        throw new ApiError(
            "Sellers can only update status to Confirmed, Processing, Shipped, or Cancelled. Delivery milestones are managed by logistics.",
            400
        );
    }

    // Shipped status ke liye courier details zaroori hain
    if (orderstatus === "shipped" && (!courier || !trackingNumber)) {
        throw new ApiError("Courier name and Tracking Number are required to mark an order as Shipped", 400);
    }

    // Check karein ki yeh order isi seller ke product ka hai
    const order = await Order.findOne({
        _id: orderId,
        "orderitem.seller": sellerId,
    });

    if (!order) {
        throw new ApiError("Order not found or you are not authorized to update this order", 404);
    }

    order.orderstatus = orderstatus;

    if (courier) order.courier = courier.trim();
    if (trackingNumber) order.trackingNumber = trackingNumber.trim();

    const defaultMessages = {
        confirmed: "Order confirmed by seller and being prepared.",
        processing: "Items are being packed securely for dispatch.",
         rtd: "Order packed securely and Ready to Dispatch (RTD). Awaiting courier pickup.",
        shipped: `Package dispatched via ${courier || order.courier} (AWB: ${trackingNumber || order.trackingNumber}). Handed over to logistics partner.`,
        cancelled: "Order cancelled by seller due to inventory constraints.",
    };

    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
        status: orderstatus,
        timestamp: new Date(),
        message: message || defaultMessages[orderstatus] || `Status updated to ${orderstatus}`,
        location: location || "Seller Warehouse Hub",
    });

    await order.save();

    res.status(200).json({
        success: true,
        message: `Order status successfully updated to ${orderstatus}`,
        order,
    });
});