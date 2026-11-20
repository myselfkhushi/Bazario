import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaBoxOpen,
    FaArrowRight,
} from "react-icons/fa";
import { MapPin, Package, Truck, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { getMyOrders } from "../../features/order/orderAPI";
import {
    setLoading,
    setOrders,
    setError,
} from "../../features/order/orderSlice";

function Orders() {
    const dispatch = useDispatch();

    const { orders, loading, error } = useSelector(
        (state) => state.order
    );

    const safeOrders = Array.isArray(orders) ? orders : [];

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                dispatch(setLoading(true));
                const response = await getMyOrders();
                // Ensure compatibility with both 'orders' and 'order' keys
                const orderData = response?.orders || response?.order || [];
                dispatch(setOrders(Array.isArray(orderData) ? orderData : []));
            } catch (err) {
                console.error("Fetch orders failed:", err);
                dispatch(
                    setError(
                        err.response?.data?.message ||
                            "Failed to load your orders"
                    )
                );
            }
        };

        fetchOrders();
    }, [dispatch]);

    if (loading) {
        return (
            <div className="min-h-[70vh] bg-white flex items-center justify-center">
                <div className="text-center flex flex-col items-center">
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-purple-600 rounded-full animate-spin" />
                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Loading Orders...
                    </p>
                </div>
            </div>
        );
    }

    if (error && safeOrders.length === 0) {
        return (
            <div className="min-h-[70vh] bg-white flex items-center justify-center px-4">
                <div className="max-w-md w-full text-center p-8 border border-red-200 bg-red-50/50 rounded-3xl shadow-sm">
                    <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full mx-auto flex items-center justify-center mb-4">
                        <AlertCircle className="w-7 h-7" />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2">Could not load orders</h2>
                    <p className="text-sm font-medium text-slate-500 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-purple-200 cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/60 text-slate-900 pb-20">
            {/* HEADER */}
            <div className="border-b border-slate-200 bg-white">
                <div className="max-w-5xl mx-auto px-6 py-10">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-purple-600 mb-2">
                                <span className="w-6 h-0.5 bg-purple-600" />
                                Account & Activity
                            </div>
                            <h1
                                className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900"
                                style={{ fontFamily: "var(--font-heading)" }}
                            >
                                Order History
                            </h1>
                            <p className="text-slate-500 mt-1 text-sm font-medium">
                                Track, manage, and review your purchases and doorstep deliveries.
                            </p>
                        </div>
                        <div className="text-left sm:text-right border-l-2 border-purple-100 sm:border-slate-200 pl-6">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                                Total Orders
                            </p>
                            <p className="text-3xl font-black mt-1 text-slate-900">
                                {safeOrders.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN */}
            <main className="max-w-5xl mx-auto px-6 py-10">
                {safeOrders.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="min-h-[45vh] flex items-center justify-center bg-white border border-dashed border-slate-300 rounded-3xl p-8">
                        <div className="max-w-md w-full text-center">
                            <div className="w-16 h-16 bg-purple-50 text-purple-600 flex items-center justify-center rounded-2xl mx-auto mb-6 shadow-sm">
                                <FaBoxOpen className="text-2xl" />
                            </div>
                            <h2 className="text-2xl font-black mb-2 text-slate-900">No orders yet</h2>
                            <p className="text-slate-500 text-sm font-medium mb-8">
                                You haven't placed any orders yet. Discover our latest collection and start shopping today.
                            </p>
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-7 py-3.5 text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md shadow-purple-200"
                            >
                                Start Shopping
                                <FaArrowRight size={10} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {safeOrders.map((order) => {
                            const orderItems = Array.isArray(order.orderitem) ? order.orderitem : [];
                            const orderIdDisplay = String(order._id || "").slice(-8).toUpperCase();

                            return (
                                <div
                                    key={order._id}
                                    className="border border-slate-200/90 rounded-3xl bg-white shadow-xs overflow-hidden"
                                >
                                    {/* ORDER HEADER */}
                                    <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200/80">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center gap-6">
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                                        Order ID
                                                    </p>
                                                    <p className="font-mono text-sm font-black text-slate-900 mt-0.5">
                                                        #{orderIdDisplay}
                                                    </p>
                                                </div>
                                                <div className="hidden sm:block w-px h-8 bg-slate-200" />
                                                <div>
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                                        Total Amount
                                                    </p>
                                                    <p className="text-sm font-black text-slate-900 mt-0.5">
                                                        ₹{Number(order.totalamount || 0).toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <span className="inline-flex items-center px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-[10px] font-bold uppercase tracking-wider text-purple-700">
                                                    {order.orderstatus || "Confirmed"}
                                                </span>

                                                {/* Track Order Live Button */}
                                                <Link
                                                    to={`/track-order?id=${order._id}`}
                                                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                                                >
                                                    <Truck className="w-3.5 h-3.5" />
                                                    <span>Track Order</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                    {/* PRODUCTS */}
                                    <div className="p-6">
                                        <div className="divide-y divide-slate-100">
                                            {orderItems.map((item, idx) => {
                                                const imageUrl =
                                                    item.image ||
                                                    item.product?.images?.[0]?.url ||
                                                    "";
                                                const title =
                                                    item.title ||
                                                    item.product?.title ||
                                                    "Product item";
                                                const brand =
                                                    item.brand ||
                                                    item.product?.brand ||
                                                    item.product?.category ||
                                                    "Bazario Official";
                                                const price = Number(
                                                    item.price ||
                                                    item.product?.price ||
                                                    0
                                                );
                                                const qty = item.quantity || 1;

                                                return (
                                                    <div
                                                        key={item._id || idx}
                                                        className={`flex flex-col sm:flex-row gap-6 items-center ${
                                                            idx > 0 ? "pt-6" : ""
                                                        } ${
                                                            idx < orderItems.length - 1 ? "pb-6" : ""
                                                        }`}
                                                    >
                                                        {/* IMAGE */}
                                                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 border border-slate-200 rounded-2xl shrink-0 flex items-center justify-center overflow-hidden">
                                                            {imageUrl ? (
                                                                <img
                                                                    src={imageUrl}
                                                                    alt={title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="w-8 h-8 text-slate-400" />
                                                            )}
                                                        </div>

                                                        {/* DETAILS */}
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[10px] uppercase tracking-wider font-bold text-purple-600 mb-0.5">
                                                                {brand}
                                                            </p>
                                                            <h3 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1">
                                                                {title}
                                                            </h3>

                                                            <div className="flex items-center gap-6 mt-3">
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                                                        Qty
                                                                    </p>
                                                                    <p className="text-sm font-bold mt-0.5 text-slate-800">
                                                                        {qty}
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                                                        Unit Price
                                                                    </p>
                                                                    <p className="text-sm font-bold mt-0.5 text-slate-800">
                                                                        ₹{price.toLocaleString("en-IN")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* ITEM TOTAL */}
                                                        <div className="sm:text-right sm:self-center border-t sm:border-t-0 sm:border-l border-slate-100 pt-3 sm:pt-0 sm:pl-6 w-full sm:w-auto">
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                                                                Item Total
                                                            </p>
                                                            <p className="text-base sm:text-lg font-black mt-0.5 text-slate-900">
                                                                ₹{(price * qty).toLocaleString("en-IN")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* SHIPPING / DELIVERY ADDRESS FOOTER */}
                                    {order.shippingAddress && (
                                        <div className="bg-slate-50/70 border-t border-slate-200/80 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
                                            <div className="flex items-start sm:items-center gap-2">
                                                <span className="inline-flex items-center gap-1 font-bold text-slate-900 shrink-0">
                                                    <MapPin className="w-3.5 h-3.5 text-purple-600" />
                                                    Delivery to:
                                                </span>
                                                <span className="leading-snug">
                                                    <strong className="text-slate-800">
                                                        {order.shippingAddress.fullName || "Customer"}
                                                    </strong>
                                                    {order.shippingAddress.phone &&
                                                        ` (📞 +91 ${order.shippingAddress.phone})`}{" "}
                                                    •{" "}
                                                    {order.shippingAddress.street ||
                                                        order.shippingAddress.address ||
                                                        ""}
                                                    , {order.shippingAddress.city},{" "}
                                                    {order.shippingAddress.state} -{" "}
                                                    {order.shippingAddress.pincode ||
                                                        order.shippingAddress.postalCode}
                                                </span>
                                            </div>
                                            <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0 self-start sm:self-auto uppercase tracking-wider flex items-center gap-1">
                                                <CheckCircle2 className="w-3 h-3" />
                                                <span>Free Express Delivery</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Orders;
