import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaBoxOpen,
    FaArrowRight,
    FaReceipt,
} from "react-icons/fa";
import { MapPin } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

import { getMyOrders } from "../../features/order/orderAPI";
import {
    setLoading,
    setOrders,
    setError,
} from "../../features/order/orderSlice";

function Orders() {
    const dispatch = useDispatch();

    const { orders, loading } = useSelector(
        (state) => state.order
    );

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                dispatch(setLoading(true));
                const response = await getMyOrders();
                dispatch(setOrders(response.order));
            } catch (error) {
                dispatch(
                    setError(
                        error.response?.data?.message ||
                            "Something went wrong"
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
                    <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Loading Orders...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* HEADER */}
            <div className="border-b border-slate-200 bg-slate-50">
                <div className="max-w-5xl mx-auto px-6 py-12">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
                        <div>
                            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-500 mb-2">
                                <span className="w-6 h-px bg-slate-400" />
                                Account
                            </div>
                            <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                                Order History
                            </h1>
                            <p className="text-slate-500 mt-2 text-sm">
                                Track, manage, and review your past purchases.
                            </p>
                        </div>
                        <div className="text-left sm:text-right border-l-2 border-slate-200 pl-6">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                                Total Orders
                            </p>
                            <p className="text-3xl font-black mt-1">
                                {orders.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* MAIN */}
            <main className="max-w-5xl mx-auto px-6 py-12">
                {orders.length === 0 ? (
                    /* EMPTY STATE */
                    <div className="min-h-[40vh] flex items-center justify-center border border-dashed border-slate-300">
                        <div className="max-w-md w-full text-center p-8">
                            <div className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-full mx-auto mb-6">
                                <FaBoxOpen className="text-slate-400 text-2xl" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
                            <p className="text-slate-500 text-sm mb-8">
                                You haven't placed any orders. Discover something you like and start shopping today.
                            </p>
                            <Link
                                to="/"
                                className="inline-flex items-center gap-3 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors"
                            >
                                Start Shopping
                                <FaArrowRight size={10} />
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                                className="border border-slate-200 bg-white"
                            >
                                {/* ORDER HEADER */}
                                <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div className="flex items-center gap-6">
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Order ID</p>
                                                <p className="font-mono text-sm font-bold mt-1">#{order._id.slice(-8).toUpperCase()}</p>
                                            </div>
                                            <div className="hidden sm:block w-px h-8 bg-slate-200" />
                                            <div>
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Total Amount</p>
                                                <p className="text-sm font-bold mt-1">₹{Number(order.totalamount).toLocaleString("en-IN")}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="inline-flex items-center px-3 py-1 border border-slate-300 bg-white text-[10px] font-bold uppercase tracking-widest text-slate-700">
                                                {order.orderstatus}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* PRODUCTS */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {order.orderitem.map((item) => (
                                            <div
                                                key={item._id}
                                                className="flex flex-col sm:flex-row gap-6"
                                            >
                                                {/* IMAGE */}
                                                <div className="w-24 h-24 bg-slate-100 border border-slate-200 shrink-0">
                                                    <img
                                                        src={item.product?.images?.[0]?.url || "/placeholder-product.png"}
                                                        alt={item.product?.title || "Product"}
                                                        className="w-full h-full object-cover mix-blend-multiply"
                                                    />
                                                </div>

                                                {/* DETAILS */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">
                                                        {item.product?.brand || item.product?.category || "Product"}
                                                    </p>
                                                    <h3 className="text-base font-bold text-slate-900 line-clamp-1">
                                                        {item.product?.title || "Product unavailable"}
                                                    </h3>
                                                    
                                                    <div className="flex items-center gap-6 mt-4">
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Qty</p>
                                                            <p className="text-sm font-bold mt-1">{item.quantity}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Price</p>
                                                            <p className="text-sm font-bold mt-1">
                                                                ₹{Number(item.price || item.product?.price || 0).toLocaleString("en-IN")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* ITEM TOTAL */}
                                                <div className="sm:text-right sm:self-center border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6 mt-2 sm:mt-0">
                                                    <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Item Total</p>
                                                    <p className="text-lg font-black mt-1">
                                                        ₹{((item.price || item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* SHIPPING / DELIVERY ADDRESS INFO */}
                                {order.shippingAddress && (
                                    <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
                                        <div className="flex items-start sm:items-center gap-2">
                                            <span className="inline-flex items-center gap-1 font-bold text-slate-900 shrink-0">
                                                <MapPin className="w-3.5 h-3.5 text-purple-600" />
                                                Delivery to:
                                            </span>
                                            <span>
                                                <strong className="text-slate-800">{order.shippingAddress.fullName}</strong>
                                                {order.shippingAddress.phone && ` (📞 +91 ${order.shippingAddress.phone})`} • {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                            </span>
                                        </div>
                                        <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0 self-start sm:self-auto">
                                            Standard Delivery
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Orders;