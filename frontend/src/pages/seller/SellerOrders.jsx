import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "lucide-react";

import { getSellerOrders } from "../../features/seller/sellerSlice";

function SellerOrders() {
    const dispatch = useDispatch();

    const {
        orders = [],
        loading,
        error,
    } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(getSellerOrders());
    }, [dispatch]);

    const getStatusStyle = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "Shipped":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "Processing":
                return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case "Pending":
                return "bg-amber-50 text-amber-700 border-amber-200";
            case "Cancelled":
                return "bg-rose-50 text-rose-700 border-rose-200";
            default:
                return "bg-slate-100 text-slate-700 border-slate-200";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered":
                return <CheckCircle2 className="w-3.5 h-3.5" />;
            case "Shipped":
                return <Truck className="w-3.5 h-3.5" />;
            case "Processing":
                return <Clock className="w-3.5 h-3.5" />;
            default:
                return <Clock className="w-3.5 h-3.5" />;
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
                                                    {item.product?.images?.[0] ? (
                                                        <img 
                                                            src={item.product.images[0].url} 
                                                            alt={item.product?.title}
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
                                                        {item.product?.title || "Product Unavailable"}
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
                                    
                                    {/* Status */}
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Order Status</h4>
                                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${getStatusStyle(order.orderstatus)}`}>
                                            {getStatusIcon(order.orderstatus)}
                                            <span className="text-[10px] font-black uppercase tracking-widest">
                                                {order.orderstatus}
                                            </span>
                                        </div>
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
                                            {order.shippinginfo ? (
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
        </div>
    );
}

export default SellerOrders;