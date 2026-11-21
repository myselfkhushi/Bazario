import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";

// Helper: Filter order items strictly to the requesting seller's products
// and calculate seller-specific subtotal
const formatOrderForSeller = (order, sellerId) => {
    const rawOrder = order.toObject ? order.toObject() : order;
    const sellerIdStr = sellerId.toString();

    const sellerItems = (rawOrder.orderitem || []).filter(
        (item) => (item.seller?._id || item.seller)?.toString() === sellerIdStr
    );

    const sellerTotalAmount = sellerItems.reduce(
        (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
        0
    );

    const sellerTotalQuantity = sellerItems.reduce(
        (sum, item) => sum + (Number(item.quantity) || 1),
        0
    );

    return {
        ...rawOrder,
        orderitem: sellerItems,
        totalamount: sellerTotalAmount, // Overridden to seller-specific revenue for direct UI compatibility
        sellerTotalAmount,
        sellerTotalQuantity,
        grandOrderTotal: rawOrder.totalamount, // Preserved for transparency
    };
};

// 1. GET SELLER DASHBOARD METRICS
export const getSellerDashboard = asynchandler(async (req, res) => {
    const sellerId = req.user._id;
    const sellerIdStr = sellerId.toString();

    // 1. Products metrics
    const totalProducts = await Product.countDocuments({
        createdBy: sellerId,
    });

    const lowStockProducts = await Product.countDocuments({
        createdBy: sellerId,
        stock: { $lte: 5 },
    });

    // 2. Fetch all orders containing this seller's products
    const orders = await Order.find({
        "orderitem.seller": sellerId,
    }).lean();

    let totalRevenue = 0;
    let deliveredRevenue = 0;
    let pendingRevenue = 0;
    let returnedRevenue = 0;
    let totalItemsSold = 0;

    orders.forEach((order) => {
        const st = (order.orderstatus || "").toLowerCase();

        // Calculate revenue ONLY from this seller's items in the order
        const sellerItems = (order.orderitem || []).filter(
            (item) => (item.seller?._id || item.seller)?.toString() === sellerIdStr
        );

        const orderSellerAmount = sellerItems.reduce((sum, item) => {
            const qty = Number(item.quantity) || 1;
            totalItemsSold += qty;
            return sum + (Number(item.price) || 0) * qty;
        }, 0);

        // Do not count cancelled or returned orders in active revenue
        if (!["cancelled", "returned", "rto"].includes(st)) {
            totalRevenue += orderSellerAmount;
        }

        if (st === "delivered") {
            deliveredRevenue += orderSellerAmount;
        } else if (
            ["pending", "confirmed", "processing", "rtd", "shipped", "out_for_delivery"].includes(st)
        ) {
            pendingRevenue += orderSellerAmount;
        } else if (["cancelled", "returned", "return_requested", "rto"].includes(st)) {
            returnedRevenue += orderSellerAmount;
        }
    });

    // 3. Fetch Recent Orders (filtered strictly to this seller's items)
    const recentOrdersRaw = await Order.find({
        "orderitem.seller": sellerId,
    })
        .populate("user", "name email")
        .populate("orderitem.product", "title images price")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    const recentOrders = recentOrdersRaw.map((order) =>
        formatOrderForSeller(order, sellerId)
    );

    res.status(200).json({
        success: true,
        dashboard: {
            totalProducts,
            totalOrders: orders.length,
            totalRevenue,
            deliveredRevenue,
            pendingRevenue,
            returnedRevenue,
            totalItemsSold,
            lowStockProducts,
            recentOrders,
        },
    });
});

// 2. GET RECENT ORDERS
export const getRecentOrders = asynchandler(async (req, res) => {
    const sellerId = req.user._id;

    const ordersRaw = await Order.find({
        "orderitem.seller": sellerId,
    })
        .populate("user", "name email")
        .populate("orderitem.product", "title images price")
        .sort({ createdAt: -1 })
        .limit(10)
        .lean();

    const orders = ordersRaw.map((order) => formatOrderForSeller(order, sellerId));

    res.status(200).json({
        success: true,
        orders,
    });
});

// 3. GET ALL SELLER ORDERS (Strict Multi-Vendor Isolation)
export const getSellerOrders = asynchandler(async (req, res) => {
    const sellerId = req.user._id;

    const ordersRaw = await Order.find({
        "orderitem.seller": sellerId,
    })
        .populate("user", "name email")
        .populate("orderitem.product", "title images price")
        .sort({ createdAt: -1 })
        .lean();

    // Multi-Vendor Isolation: Each seller receives ONLY their items and their exact revenue amount
    const orders = ordersRaw.map((order) => formatOrderForSeller(order, sellerId));

    res.status(200).json({
        success: true,
        totalOrders: orders.length,
        orders,
    });
});

// 4. SELLER ORDER STATUS UPDATE
export const updateSellerOrderStatus = asynchandler(async (req, res) => {
    const sellerId = req.user._id;
    const { orderId } = req.params;
    const { orderstatus, courier, trackingNumber, location, message } = req.body;

    const allowedSellerStatuses = [
        "confirmed",
        "processing",
        "rtd",
        "shipped",
        "cancelled",
        "returned",
        "rto",
    ];

    const normalizedStatus = (orderstatus || "").toLowerCase();

    if (!allowedSellerStatuses.includes(normalizedStatus)) {
        throw new ApiError(
            "Sellers can only update status to Confirmed, Processing, RTD, Shipped, or Cancelled.",
            400
        );
    }

    if (normalizedStatus === "shipped" && (!courier || !trackingNumber)) {
        throw new ApiError(
            "Courier name and Tracking Number are required to mark an order as Shipped",
            400
        );
    }

    // Verify order contains products from this seller
    const order = await Order.findOne({
        _id: orderId,
        "orderitem.seller": sellerId,
    });

    if (!order) {
        throw new ApiError("Order not found or you are not authorized to update this order", 404);
    }

    order.orderstatus = normalizedStatus;

    if (courier) order.courier = courier.trim();
    if (trackingNumber) order.trackingNumber = trackingNumber.trim();

    const defaultMessages = {
        confirmed: "Order confirmed by seller and being prepared.",
        processing: "Items are being packed securely for dispatch.",
        rtd: "Order packed securely and Ready to Dispatch (RTD). Awaiting courier pickup.",
        shipped: `Package dispatched via ${courier || order.courier} (AWB: ${
            trackingNumber || order.trackingNumber
        }). Handed over to logistics partner.`,
        cancelled: "Order item cancelled by seller due to inventory constraints.",
    };

    order.statusHistory = order.statusHistory || [];
    order.statusHistory.push({
        status: normalizedStatus,
        timestamp: new Date(),
        message: message || defaultMessages[normalizedStatus] || `Status updated to ${normalizedStatus}`,
        location: location || "Seller Warehouse Hub",
    });

    await order.save();

    const formattedOrder = formatOrderForSeller(order, sellerId);

    res.status(200).json({
        success: true,
        message: `Order status successfully updated to ${normalizedStatus}`,
        order: formattedOrder,
    });
});
