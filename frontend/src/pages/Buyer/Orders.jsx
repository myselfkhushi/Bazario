import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBoxOpen, FaArrowRight } from "react-icons/fa";
import {
    MapPin,
    Package,
    Truck,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    RotateCcw,
    X,
    CreditCard,
    ShieldAlert,
    RefreshCw,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
    getMyOrders,
    cancelOrderAPI,
    returnOrderAPI,
} from "../../features/order/orderAPI";
import {
    setLoading,
    setOrders,
    setError,
} from "../../features/order/orderSlice";

const CANCELLATION_REASONS = [
    "Ordered by mistake / accidental order",
    "Found a cheaper price elsewhere",
    "Delivery timeline is longer than expected",
    "Need to change shipping address or items",
    "Payment / billing method change needed",
    "Other reasons",
];

const RETURN_REASONS = [
    "Defective, broken, or damaged item",
    "Product does not match website photos or description",
    "Size, fit, or color issue",
    "Received wrong or incomplete item",
    "Quality not satisfactory",
    "Other reasons",
];

function Orders() {
    const dispatch = useDispatch();

    const { orders, loading, error } = useSelector((state) => state.order);
    const safeOrders = Array.isArray(orders) ? orders : [];

    // Modal States
    const [cancelModalOrder, setCancelModalOrder] = useState(null);
    const [cancelReason, setCancelReason] = useState(CANCELLATION_REASONS[0]);
    const [actionLoading, setActionLoading] = useState(false);

    const [returnModalOrder, setReturnModalOrder] = useState(null);
    const [returnReason, setReturnReason] = useState(RETURN_REASONS[0]);
    const [returnComments, setReturnComments] = useState("");

    const fetchOrders = async () => {
        try {
            dispatch(setLoading(true));
            const response = await getMyOrders();
            const orderData = response?.orders || response?.order || [];
            dispatch(setOrders(Array.isArray(orderData) ? orderData : []));
        } catch (err) {
            console.error("Fetch orders failed:", err);
            dispatch(
                setError(
                    err.response?.data?.message || "Failed to load your orders"
                )
            );
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [dispatch]);

    // Check if order is eligible for cancellation (before shipped)
    const isCancellable = (status) => {
        const s = (status || "").toLowerCase();
        return ["pending", "confirmed", "processing", "rtd"].includes(s);
    };

    // Check if order is eligible for return (after delivery)
    const isReturnable = (status) => {
        const s = (status || "").toLowerCase();
        return s === "delivered";
    };

    // Get formatted status badge
    const getStatusBadge = (status) => {
        const s = (status || "").toLowerCase();
        if (s === "cancelled") {
            return {
                label: "Cancelled",
                className: "bg-red-50 text-red-700 border-red-200",
            };
        }
        if (s === "return_requested") {
            return {
                label: "Return Requested",
                className: "bg-amber-50 text-amber-800 border-amber-200",
            };
        }
        if (s === "returned") {
            return {
                label: "Returned",
                className: "bg-purple-50 text-purple-700 border-purple-200",
            };
        }
        if (s === "delivered") {
            return {
                label: "Delivered",
                className: "bg-emerald-50 text-emerald-700 border-emerald-200",
            };
        }
        if (["shipped", "out_for_delivery"].includes(s)) {
            return {
                label: s === "out_for_delivery" ? "Out for Delivery" : "Shipped",
                className: "bg-blue-50 text-blue-700 border-blue-200",
            };
        }
        return {
            label: s.charAt(0).toUpperCase() + s.slice(1) || "Confirmed",
            className: "bg-purple-50 text-purple-700 border-purple-200",
        };
    };

    // Handle Order Cancellation
    const handleConfirmCancel = async () => {
        if (!cancelModalOrder) return;
        try {
            setActionLoading(true);
            const res = await cancelOrderAPI(cancelModalOrder._id, {
                reason: cancelReason,
            });

            toast.success(
                res.message || "Order cancelled successfully! Refund initiated if prepaid."
            );

            // Update in local redux state
            const updated = safeOrders.map((o) =>
                o._id === cancelModalOrder._id
                    ? {
                          ...o,
                          orderstatus: "cancelled",
                          statusHistory: [
                              ...(o.statusHistory || []),
                              {
                                  status: "cancelled",
                                  timestamp: new Date(),
                                  message: `Cancelled by user. ${res.refundMessage || ""}`,
                              },
                          ],
                      }
                    : o
            );
            dispatch(setOrders(updated));
            setCancelModalOrder(null);
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to cancel order"
            );
        } finally {
            setActionLoading(false);
        }
    };

    // Handle Order Return Request
    const handleConfirmReturn = async () => {
        if (!returnModalOrder) return;
        try {
            setActionLoading(true);
            const res = await returnOrderAPI(returnModalOrder._id, {
                reason: returnReason,
                comments: returnComments,
            });

            toast.success(
                res.message || "Return requested! Reverse courier pickup scheduled."
            );

            // Update in local redux state
            const updated = safeOrders.map((o) =>
                o._id === returnModalOrder._id
                    ? {
                          ...o,
                          orderstatus: "return_requested",
                          statusHistory: [
                              ...(o.statusHistory || []),
                              {
                                  status: "return_requested",
                                  timestamp: new Date(),
                                  message: `Return requested: ${returnReason}`,
                              },
                          ],
                      }
                    : o
            );
            dispatch(setOrders(updated));
            setReturnModalOrder(null);
            setReturnComments("");
        } catch (err) {
            console.error(err);
            toast.error(
                err.response?.data?.message || "Failed to submit return request"
            );
        } finally {
            setActionLoading(false);
        }
    };

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
                        onClick={fetchOrders}
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
                                Track orders, manage doorstep deliveries, process returns or cancel anytime before shipping.
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
                            const statusBadge = getStatusBadge(order.orderstatus);
                            const cancellable = isCancellable(order.orderstatus);
                            const returnable = isReturnable(order.orderstatus);
                            const isCancelled = (order.orderstatus || "").toLowerCase() === "cancelled";
                            const isReturnRequested = (order.orderstatus || "").toLowerCase() === "return_requested";

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

                                            <div className="flex items-center gap-2.5 flex-wrap">
                                                {/* Status Pill */}
                                                <span
                                                    className={`inline-flex items-center px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusBadge.className}`}
                                                >
                                                    {statusBadge.label}
                                                </span>

                                                {/* CANCEL ORDER BUTTON (If not yet shipped) */}
                                                {cancellable && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCancelModalOrder(order);
                                                            setCancelReason(CANCELLATION_REASONS[0]);
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[11px] font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                                                    >
                                                        <XCircle className="w-3.5 h-3.5" />
                                                        <span>Cancel Order</span>
                                                    </button>
                                                )}

                                                {/* RETURN ORDER BUTTON (If delivered) */}
                                                {returnable && (
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setReturnModalOrder(order);
                                                            setReturnReason(RETURN_REASONS[0]);
                                                            setReturnComments("");
                                                        }}
                                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        <span>Return Product</span>
                                                    </button>
                                                )}

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

                                    {/* STATUS NOTICES */}
                                    {isCancelled && (
                                        <div className="bg-rose-50/70 border-b border-rose-100 px-6 py-3 flex items-center gap-2.5 text-xs text-rose-800">
                                            <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                                            <div>
                                                <span className="font-bold">Order Cancelled:</span>{" "}
                                                If you paid online, your refund of ₹
                                                {Number(order.totalamount || 0).toLocaleString("en-IN")}{" "}
                                                has been automatically initiated to your original bank/UPI account (takes 5–7 business days).
                                            </div>
                                        </div>
                                    )}

                                    {isReturnRequested && (
                                        <div className="bg-amber-50/70 border-b border-amber-100 px-6 py-3 flex items-center gap-2.5 text-xs text-amber-900">
                                            <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
                                            <div>
                                                <span className="font-bold">Return Request Under Process:</span>{" "}
                                                Our reverse courier logistics will contact you to schedule doorstep pickup. Refund will be credited upon pickup verification.
                                            </div>
                                        </div>
                                    )}

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

            {/* ======================================================== */}
            {/* CANCEL ORDER MODAL                                      */}
            {/* ======================================================== */}
            {cancelModalOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                            <div className="flex items-center gap-2.5 text-rose-600">
                                <XCircle className="w-5 h-5" />
                                <h3 className="font-extrabold text-slate-900 text-base">
                                    Cancel Order #{String(cancelModalOrder._id).slice(-8).toUpperCase()}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setCancelModalOrder(null)}
                                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            {/* Prepaid Refund Highlight Card */}
                            <div className="p-4 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-start gap-3">
                                <CreditCard className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                                <div className="text-xs text-purple-900 leading-relaxed">
                                    <p className="font-bold">Automated Prepaid Refund Guarantee</p>
                                    <p className="mt-0.5 text-purple-800">
                                        If paid online, your full amount of{" "}
                                        <strong className="font-black text-purple-950">
                                            ₹{Number(cancelModalOrder.totalamount || 0).toLocaleString("en-IN")}
                                        </strong>{" "}
                                        will be automatically refunded to your original payment method (Card/UPI/Bank) within 5–7 business days.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Please select a reason for cancellation *
                                </label>
                                <div className="space-y-2">
                                    {CANCELLATION_REASONS.map((r) => (
                                        <label
                                            key={r}
                                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                                                cancelReason === r
                                                    ? "bg-purple-50/60 border-purple-300 text-purple-900 font-bold"
                                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="cancelReason"
                                                checked={cancelReason === r}
                                                onChange={() => setCancelReason(r)}
                                                className="text-purple-600 focus:ring-purple-500 w-4 h-4"
                                            />
                                            <span>{r}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="pt-3 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setCancelModalOrder(null)}
                                    className="w-1/2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                    Keep Order
                                </button>
                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={handleConfirmCancel}
                                    className="w-1/2 py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white font-bold text-xs rounded-xl shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {actionLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <span>Confirm Cancel</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ======================================================== */}
            {/* RETURN ORDER MODAL                                      */}
            {/* ======================================================== */}
            {returnModalOrder && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        {/* Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                            <div className="flex items-center gap-2.5 text-amber-700">
                                <RotateCcw className="w-5 h-5" />
                                <h3 className="font-extrabold text-slate-900 text-base">
                                    Return Order #{String(returnModalOrder._id).slice(-8).toUpperCase()}
                                </h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setReturnModalOrder(null)}
                                className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="p-6 space-y-4">
                            {/* Return Notice Card */}
                            <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl flex items-start gap-3">
                                <Truck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                                <div className="text-xs text-amber-900 leading-relaxed">
                                    <p className="font-bold">Hassle-Free Doorstep Reverse Pickup</p>
                                    <p className="mt-0.5 text-amber-800">
                                        Our courier partner will visit your shipping address for product pickup and verification. Full refund of{" "}
                                        <strong className="font-black text-amber-950">
                                            ₹{Number(returnModalOrder.totalamount || 0).toLocaleString("en-IN")}
                                        </strong>{" "}
                                        will be credited back to your account upon pickup confirmation.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-2">
                                    Select Return Reason *
                                </label>
                                <div className="space-y-2">
                                    {RETURN_REASONS.map((r) => (
                                        <label
                                            key={r}
                                            className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                                                returnReason === r
                                                    ? "bg-amber-50/70 border-amber-300 text-amber-900 font-bold"
                                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="returnReason"
                                                checked={returnReason === r}
                                                onChange={() => setReturnReason(r)}
                                                className="text-amber-600 focus:ring-amber-500 w-4 h-4"
                                            />
                                            <span>{r}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Additional Comments */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                    Additional details / feedback (Optional)
                                </label>
                                <textarea
                                    rows={2}
                                    value={returnComments}
                                    onChange={(e) => setReturnComments(e.target.value)}
                                    placeholder="Explain the issue or feedback for the seller..."
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-xs text-slate-900 focus:outline-none focus:border-amber-500 focus:bg-white transition-all"
                                />
                            </div>

                            {/* Buttons */}
                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setReturnModalOrder(null)}
                                    className="w-1/2 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    disabled={actionLoading}
                                    onClick={handleConfirmReturn}
                                    className="w-1/2 py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-300 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    {actionLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <span>Submit Return</span>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
