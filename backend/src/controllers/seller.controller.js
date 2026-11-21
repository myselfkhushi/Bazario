import Product from "../models/product.model.js";
import Order from "../models/order.model.js";
import asynchandler from "../utils/asynchandler.js";
import ApiError from "../utils/apierror.js";

// Helper: Filter order items strictly to the requesting seller's products
// and calculate seller-specific subtotal and individual fulfillment state
const formatOrderForSeller = (order, sellerId) => {
    const rawOrder = order.toObject ? order.toObject() : order;
    const sellerIdStr = sellerId.toString();

    // Only this seller's products
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

    // Determine this seller's independent fulfillment status
    // Priority: use item-level status; fallback to orderstatus if legacy order
    const sellerStatus = sellerItems[0]?.status || rawOrder.orderstatus || "pending";
    const sellerCourier = sellerItems[0]?.courier || rawOrder.courier || "";
    const sellerTrackingNumber = sellerItems[0]?.trackingNumber || rawOrder.trackingNumber || "";
    const isLabelPrinted =
        sellerItems.length > 0 ? sellerItems.every((i) => Boolean(i.isLabelPrinted)) : false;

    return {
        ...rawOrder,
        orderitem: sellerItems,
        orderstatus: sellerStatus, // Individual seller status
        courier: sellerCourier,
        trackingNumber: sellerTrackingNumber,
        isLabelPrinted,
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

    const totalProducts = await Product.countDocuments({
        createdBy: sellerId,
    });

    const lowStockProducts = await Product.countDocuments({
        createdBy: sellerId,
        stock: { $lte: 5 },
    });

    const orders = await Order.find({
        "orderitem.seller": sellerId,
    }).lean();

    let totalRevenue = 0;
    let deliveredRevenue = 0;
    let pendingRevenue = 0;
    let returnedRevenue = 0;
    let totalItemsSold = 0;

    orders.forEach((order) => {
        const sellerItems = (order.orderitem || []).filter(
            (item) => (item.seller?._id || item.seller)?.toString() === sellerIdStr
        );

        sellerItems.forEach((item) => {
            const itemStatus = (item.status || order.orderstatus || "").toLowerCase();
            const qty = Number(item.quantity) || 1;
            const itemAmount = (Number(item.price) || 0) * qty;

            totalItemsSold += qty;

            if (!["cancelled", "returned", "rto"].includes(itemStatus)) {
                totalRevenue += itemAmount;
            }

            if (itemStatus === "delivered") {
                deliveredRevenue += itemAmount;
            } else if (
                ["pending", "confirmed", "processing", "rtd", "shipped", "out_for_delivery"].includes(
                    itemStatus
                )
            ) {
                pendingRevenue += itemAmount;
            } else if (["cancelled", "returned", "return_requested", "rto"].includes(itemStatus)) {
                returnedRevenue += itemAmount;
            }
        });
    });

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

    const orders = ordersRaw.map((order) => formatOrderForSeller(order, sellerId));

    res.status(200).json({
        success: true,
        totalOrders: orders.length,
        orders,
    });
});

// 4. SELLER ORDER STATUS UPDATE (Strict Per-Seller Product Isolation)
export const updateSellerOrderStatus = asynchandler(async (req, res) => {
    const sellerId = req.user._id;
    const sellerIdStr = sellerId.toString();
    const { orderId } = req.params;
    const { orderstatus, courier, trackingNumber, location, message, isLabelPrinted } = req.body;

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

    // Find order
    const order = await Order.findOne({
        _id: orderId,
        "orderitem.seller": sellerId,
    });

    if (!order) {
        throw new ApiError("Order not found or you are not authorized to update this order", 404);
    }

    const defaultMessages = {
        confirmed: "Order confirmed by seller and being prepared.",
        processing: "Items are being packed securely for dispatch.",
        rtd: "Order packed securely and Ready to Dispatch (RTD). Awaiting courier pickup.",
        shipped: `Package dispatched via ${courier || order.courier} (AWB: ${
            trackingNumber || order.trackingNumber
        }). Handed over to logistics partner.`,
        cancelled: "Order item cancelled by seller due to inventory constraints.",
    };

    // 🔒 ATOMIC MULTI-VENDOR ISOLATION:
    // Update ONLY items belonging to this specific seller!
    let sellerItemsUpdated = 0;
    for (const item of order.orderitem) {
        if ((item.seller?._id || item.seller)?.toString() === sellerIdStr) {
            item.status = normalizedStatus;
            if (courier) item.courier = courier.trim();
            if (trackingNumber) item.trackingNumber = trackingNumber.trim();
            if (isLabelPrinted !== undefined) {
                item.isLabelPrinted = Boolean(isLabelPrinted);
            }

            if (!item.statusHistory) item.statusHistory = [];
            item.statusHistory.push({
                status: normalizedStatus,
                timestamp: new Date(),
                message:
                    message ||
                    defaultMessages[normalizedStatus] ||
                    `Status updated to ${normalizedStatus}`,
                location: location || "Seller Warehouse Hub",
            });
            sellerItemsUpdated++;
        }
    }

    // Calculate aggregated status for overall order
    const allStatuses = order.orderitem.map((i) => (i.status || "pending").toLowerCase());
    if (allStatuses.every((s) => s === "delivered")) {
        order.orderstatus = "delivered";
    } else if (allStatuses.every((s) => s === "cancelled")) {
        order.orderstatus = "cancelled";
    } else if (allStatuses.some((s) => ["shipped", "out_for_delivery"].includes(s))) {
        order.orderstatus = "shipped";
    } else if (allStatuses.some((s) => ["processing", "rtd"].includes(s))) {
        order.orderstatus = "processing";
    } else if (allStatuses.some((s) => s === "confirmed")) {
        order.orderstatus = "confirmed";
    }

    if (!order.statusHistory) order.statusHistory = [];
    order.statusHistory.push({
        status: normalizedStatus,
        timestamp: new Date(),
        message: `Seller updated item status to ${normalizedStatus}`,
        location: location || "Seller Fulfillment Center",
    });

    await order.save();

    const formattedOrder = formatOrderForSeller(order, sellerId);

    res.status(200).json({
        success: true,
        message: `Order status successfully updated to ${normalizedStatus}`,
        order: formattedOrder,
    });
});

// 5. MARK SHIPPING LABEL AS PRINTED (Seller Specific)
export const markSellerLabelPrinted = asynchandler(async (req, res) => {
    const sellerId = req.user._id;
    const sellerIdStr = sellerId.toString();
    const { orderId } = req.params;

    const order = await Order.findOne({
        _id: orderId,
        "orderitem.seller": sellerId,
    });

    if (!order) {
        throw new ApiError("Order not found or unauthorized", 404);
    }

    for (const item of order.orderitem) {
        if ((item.seller?._id || item.seller)?.toString() === sellerIdStr) {
            item.isLabelPrinted = true;
        }
    }

    await order.save();

    const formattedOrder = formatOrderForSeller(order, sellerId);

    res.status(200).json({
        success: true,
        message: "Shipping label marked as printed",
        order: formattedOrder,
    });
});
