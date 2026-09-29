import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    PackageOpen,
    CheckCircle2,
    Clock,
    Truck,
    User,
    Mail,
    Receipt,
    Store,
    Calendar,
    Send,
    X,
    AlertCircle,
    Check
} from "lucide-react";

import { getSellerOrders } from "../../features/seller/sellerSlice";
import { updateSellerOrderStatus } from "../../features/seller/sellerAPI";

function SellerOrders() {
    const dispatch = useDispatch();

    const {
        orders = [],
        loading,
        error,
    } = useSelector((state) => state.seller);

    const [updatingOrderId, setUpdatingOrderId] = useState(null);
    const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
    const [courierName, setCourierName] = useState("BlueDart");
    const [awbNumber, setAwbNumber] = useState("");

    useEffect(() => {
        dispatch(getSellerOrders());
    }, [dispatch]);

      const handleQuickStatus = async (orderId, newStatus) => {
        try {
            setUpdatingOrderId(orderId);
            await updateSellerOrderStatus(orderId, { orderstatus: newStatus });
            toast.success(`Order marked as ${newStatus.toUpperCase()}`);
            dispatch(getSellerOrders());
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to update status");
        } finally {
            setUpdatingOrderId(null);
        }
    };
    // Shipped dispatch form submit handler
    const handleDispatchSubmit = async (e) => {
        e.preventDefault();
        if (!dispatchModalOrder) return;
        if (!awbNumber.trim()) {
            toast.error("Please enter a valid Tracking / AWB Number");
            return;
        }
        try {
            setUpdatingOrderId(dispatchModalOrder._id);
            await updateSellerOrderStatus(dispatchModalOrder._id, {
                orderstatus: "shipped",
                courier: courierName,
                trackingNumber: awbNumber.trim(),
            });
            toast.success("Parcel dispatched to courier successfully!");
            setDispatchModalOrder(null);
            setAwbNumber("");
            dispatch(getSellerOrders());
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to dispatch order");
        } finally {
            setUpdatingOrderId(null);
        }
    };

    return (
        <div className="font-sans text-slate-900">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        Orders Management
                    </h1>
                    <p className="text-slate-500 text-sm mt-2 font-medium">
                        View and track all customer orders.
                    </p>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-3">
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-600">Live Sync</span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-24">
                    <div className="w-8 h-8 border-4 border-slate-200 border-t-purple-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-sm font-bold text-slate-500">Loading your orders...</p>
                </div>
            ) : error ? (
                <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 text-center">
                    <p className="text-rose-600 font-bold">{error}</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-3xl p-16 text-center shadow-sm">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <PackageOpen className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">No orders yet</h3>
                    <p className="text-slate-500 text-sm font-medium">When customers place orders for your products, they will appear here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            
                            {/* Order Header */}
                            <div className="bg-slate-50 border-b border-slate-100 px-6 sm:px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center">
                                        <Receipt className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Order ID</p>
                                        <p className="font-bold text-slate-900 text-sm">#{order._id}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 text-sm">
                                    <div className="hidden sm:block">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Placed On</p>
                                        <div className="flex items-center gap-1.5 font-bold text-slate-700">
                                            <Calendar className="w-4 h-4 text-slate-400" />
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 text-right">Total Amount</p>
                                        <p className="font-black text-slate-900 text-right text-lg">₹{order.totalamount.toLocaleString("en-IN")}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 sm:p-8 flex flex-col lg:flex-row gap-8 lg:gap-12">
                                
                                {/* Items List */}
                                <div className="flex-1">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Items Ordered</h4>
                                    <div className="space-y-4">
                                        {order.orderitem.map((item, index) => (
                                            <div key={index} className="flex gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                                <div className="w-16 h-16 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shrink-0">
                                                    {(item.image || item.product?.images?.[0]?.url) ? (
                                                        <img 
                                                            src={item.image || item.product?.images?.[0]?.url} 
                                                            alt={item.title || item.product?.title || "Product"}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <PackageOpen className="w-6 h-6 text-slate-400" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <h5 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">
                                                        {item.title || item.product?.title || "Product Unavailable"}
                                                    </h5>       
                                                    <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                                                        <span>Qty: {item.quantity}</span>
                                                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                                        <span className="text-slate-900">₹{item.price.toLocaleString("en-IN")}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Order Meta (Customer & Status) */}
                                <div className="lg:w-72 shrink-0 flex flex-col gap-6 lg:border-l lg:border-slate-100 lg:pl-8">
                                    
                                                                        {/* Status & Actions */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Order Status</h4>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-3 ${getStatusStyle(order.orderstatus)}`}>
                                            {getStatusIcon(order.orderstatus)}
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {order.orderstatus}
                                            </span>
                                        </div>

                                                                                {/* 🟢 Flipkart Style Seller Action Pipeline */}
                                        <div className="space-y-2">
                                            
                                            {/* Step 1: New Order -> Generate Label */}
                                            {order.orderstatus === "pending" && (
                                                <button
                                                    disabled={updatingOrderId === order._id}
                                                    onClick={() => {
                                                        setSelectedLabelOrder(order);
                                                        handleQuickStatus(order._id, "processing");
                                                    }}
                                                    className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-purple-200 cursor-pointer"
                                                >
                                                    <Printer className="w-3.5 h-3.5" /> Generate & Print Label
                                                </button>
                                            )}

                                            {/* Step 2: Pending RTD -> Pack & Mark RTD */}
                                            {order.orderstatus === "processing" && (
                                                <div className="space-y-1.5">
                                                    <button
                                                        onClick={() => setSelectedLabelOrder(order)}
                                                        className="w-full py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-200 cursor-pointer"
                                                    >
                                                        <Printer className="w-3.5 h-3.5" /> Re-Print Label
                                                    </button>
                                                    <button
                                                        disabled={updatingOrderId === order._id}
                                                        onClick={() => handleQuickStatus(order._id, "rtd")}
                                                        className="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-indigo-200 cursor-pointer"
                                                    >
                                                        <Check className="w-3.5 h-3.5" /> Mark RTD (Ready To Dispatch)
                                                    </button>
                                                </div>
                                            )}

                                            {/* Step 3: RTD -> Courier Handover / Pickup */}
                                            {order.orderstatus === "rtd" && (
                                                <div className="space-y-1.5">
                                                    <div className="p-2 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-900 font-semibold text-center">
                                                        📦 Order Packed. Awaiting Courier Pickup.
                                                    </div>
                                                    <button
                                                        disabled={updatingOrderId === order._id}
                                                        onClick={() => setDispatchModalOrder(order)}
                                                        className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm shadow-blue-200 cursor-pointer"
                                                    >
                                                        <Truck className="w-3.5 h-3.5" /> Handover to Courier (Pickup Done)
                                                    </button>
                                                </div>
                                            )}

                                            {/* Step 4: Shipped & In Transit */}
                                            {order.orderstatus === "shipped" && (
                                                <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-[11px] text-blue-900 font-semibold space-y-0.5">
                                                    <p>Courier: <strong>{order.courier || "E-Kart Logistics"}</strong></p>
                                                    <p>AWB: <strong>{order.trackingNumber || "Assigned"}</strong></p>
                                                    <p className="text-[10px] text-blue-600 font-medium pt-1">✅ Picked up by courier. In transit to hub.</p>
                                                </div>
                                            )}

                                            {/* Step 5: Delivered */}
                                            {order.orderstatus === "delivered" && (
                                                <p className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 text-center">
                                                    Delivered to Customer
                                                </p>
                                            )}
                                        </div>

                                    {/* Customer Info */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Customer Info</h4>
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                                                    <User className="w-4 h-4 text-slate-500" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-900">{order.user?.name || "Guest User"}</p>
                                                    <p className="text-[10px] font-bold text-slate-500">{order.user?.email || "No email"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Shipping Details</h4>
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            {order.shippingAddress ? (
                                                <div className="text-xs font-medium text-slate-600 space-y-1">
                                                    <p className="font-bold text-slate-900">{order.shippingAddress.fullName}</p>
                                                    <p className="text-slate-700">{order.shippingAddress.street}</p>
                                                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                                    <p className="pt-2 mt-2 border-t border-slate-200">
                                                        <span className="font-bold text-slate-900">Phone:</span> +91 {order.shippingAddress.phone}
                                                    </p>
                                                </div>
                                            ) : order.shippinginfo ? (
                                                <div className="text-xs font-medium text-slate-600 space-y-1">
                                                    <p className="font-bold text-slate-900">{order.shippinginfo.address}</p>
                                                    <p>{order.shippinginfo.city}, {order.shippinginfo.state}</p>
                                                    <p>{order.shippinginfo.country} - {order.shippinginfo.pincode}</p>
                                                    <p className="pt-2 mt-2 border-t border-slate-200">
                                                        <span className="font-bold text-slate-900">Phone:</span> {order.shippinginfo.phoneno}
                                                    </p>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-500 italic">No shipping details provided.</p>
                                            )}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

                        {/* 🟢 Dispatch Courier Modal */}
            {dispatchModalOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Dispatch Shipment</h3>
                                <p className="text-xs text-slate-500 font-medium">Order #{dispatchModalOrder._id.slice(-6).toUpperCase()}</p>
                            </div>
                            <button
                                onClick={() => setDispatchModalOrder(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleDispatchSubmit} className="mt-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    Courier Partner
                                </label>
                                <select
                                    value={courierName}
                                    onChange={(e) => setCourierName(e.target.value)}
                                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                >
                                    <option value="BlueDart Express">BlueDart Express</option>
                                    <option value="Delhivery Surface">Delhivery Surface</option>
                                    <option value="DTDC Express">DTDC Express</option>
                                    <option value="Ekart Logistics">Ekart Logistics</option>
                                    <option value="Shadowfax">Shadowfax</option>
                                    <option value="India Post Speed Post">India Post Speed Post</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                                    AWB / Tracking Number
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. BD-904128472 or DLV-441892"
                                    value={awbNumber}
                                    onChange={(e) => setAwbNumber(e.target.value)}
                                    className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-400"
                                    required
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDispatchModalOrder(null)}
                                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={updatingOrderId === dispatchModalOrder._id}
                                    className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md shadow-purple-200 flex items-center justify-center gap-1.5"
                                >
                                    <Send className="w-3.5 h-3.5" /> Confirm Dispatch
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SellerOrders;