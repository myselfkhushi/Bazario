import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
    FaBoxOpen,
    FaCheckCircle,
    FaClock,
    FaTruck,
    FaArrowRight,
    FaReceipt,
} from "react-icons/fa";
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

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered":
                return "bg-emerald-50 text-emerald-600 border-emerald-100";

            case "Shipped":
                return "bg-blue-50 text-blue-600 border-blue-100";

            case "Pending":
                return "bg-amber-50 text-amber-600 border-amber-100";

            case "Processing":
                return "bg-indigo-50 text-indigo-600 border-indigo-100";

            case "Cancelled":
                return "bg-red-50 text-red-600 border-red-100";

            default:
                return "bg-slate-50 text-slate-600 border-slate-100";
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "Delivered":
                return <FaCheckCircle />;

            case "Shipped":
                return <FaTruck />;

            case "Processing":
                return <FaTruck />;

            default:
                return <FaClock />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">

                <div className="text-center">

                    <div className="relative w-14 h-14 mx-auto">

                        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />

                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />

                    </div>

                    <p className="mt-5 text-sm font-medium text-slate-500">
                        Loading your orders...
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f8fc]">

            {/* HEADER */}

            <div className="bg-white border-b border-slate-200">

                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">

                        <div>

                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-indigo-600">

                                <span className="w-7 h-px bg-indigo-300" />

                                Account

                            </div>

                            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
                                My Orders
                            </h1>

                            <p className="text-slate-500 mt-3">
                                Track and manage all your purchases in one place.
                            </p>

                        </div>

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4">

                            <p className="text-xs uppercase tracking-wider text-slate-400 font-bold">
                                Total Orders
                            </p>

                            <p className="text-3xl font-black text-slate-900 mt-1">
                                {orders.length}
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            {/* MAIN */}

            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

                {orders.length === 0 ? (

                    /* EMPTY STATE */

                    <div className="min-h-[55vh] flex items-center justify-center">

                        <div className="max-w-lg w-full text-center">

                            <div className="relative w-28 h-28 mx-auto">

                                <div className="absolute inset-0 bg-indigo-100 rounded-[2rem] rotate-6" />

                                <div className="absolute inset-0 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-indigo-600">

                                    <FaBoxOpen size={42} />

                                </div>

                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mt-9">
                                No orders yet
                            </h2>

                            <p className="text-slate-500 mt-3 leading-7">
                                You haven't placed any orders yet.
                                Discover something you like and start
                                shopping today.
                            </p>

                            <Link
                                to="/"
                                className="inline-flex items-center gap-3 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-xl font-bold transition shadow-lg shadow-indigo-200"
                            >
                                Start Shopping
                                <FaArrowRight size={12} />
                            </Link>

                        </div>

                    </div>

                ) : (

                    <div className="space-y-7">

                        {orders.map((order) => (

                            <div
                                key={order._id}
                                className="bg-white rounded-[1.75rem] border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.05)] overflow-hidden"
                            >

                                {/* ORDER HEADER */}

                                <div className="bg-slate-900 px-6 sm:px-8 py-6">

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                                        <div>

                                            <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase tracking-wider font-bold">

                                                <FaReceipt />

                                                Order

                                            </div>

                                            <p className="text-white font-bold mt-2 break-all">
                                                #{order._id}
                                            </p>

                                        </div>

                                        <div className="flex flex-wrap items-center gap-6">

                                            <div>

                                                <p className="text-xs text-slate-400 uppercase tracking-wider">
                                                    Total
                                                </p>

                                                <p className="text-2xl font-black text-white mt-1">
                                                    ₹
                                                    {Number(
                                                        order.totalamount
                                                    ).toLocaleString(
                                                        "en-IN"
                                                    )}
                                                </p>

                                            </div>

                                            <div className="h-10 w-px bg-white/10 hidden sm:block" />

                                            <span
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${getStatusColor(
                                                    order.orderstatus
                                                )}`}
                                            >
                                                {getStatusIcon(
                                                    order.orderstatus
                                                )}

                                                {order.orderstatus}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                {/* PRODUCTS */}

                                <div className="p-6 sm:p-8">

                                    <div className="flex items-center justify-between mb-5">

                                        <div>

                                            <h2 className="text-lg font-extrabold text-slate-900">
                                                Order Items
                                            </h2>

                                            <p className="text-sm text-slate-400 mt-1">
                                                {order.orderitem.length}{" "}
                                                {order.orderitem.length === 1
                                                    ? "product"
                                                    : "products"}
                                            </p>

                                        </div>

                                    </div>

                                    <div className="space-y-4">

                                        {order.orderitem.map((item) => (

                                            <div
                                                key={item._id}
                                                className="group border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:border-indigo-200 hover:shadow-md transition"
                                            >

                                                {/* IMAGE */}

                                                <div className="w-full sm:w-28 h-28 rounded-xl bg-slate-100 overflow-hidden shrink-0">

                                                    <img
                                                        src={item.product?.images?.[0]?.url || "/placeholder-product.png"}
                                                        alt={item.product?.title || "Product"}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                                                    />

                                                </div>

                                                {/* DETAILS */}

                                                <div className="flex-1 min-w-0">

                                                    <p className="text-xs uppercase tracking-wider font-bold text-indigo-500">
                                                        {item.product?.category || "Product"}
                                                    </p>

                                                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                                                        {item.product?.title || "Product unavailable"}
                                                    </h3>

                                                    <div className="flex flex-wrap gap-5 mt-5">

                                                        <div>

                                                            <p className="text-xs text-slate-400">
                                                                Quantity
                                                            </p>

                                                            <p className="font-bold text-slate-700 mt-1">
                                                                ×
                                                                {
                                                                    item.quantity
                                                                }
                                                            </p>

                                                        </div>

                                                        <div>

                                                            <p className="text-xs text-slate-400">
                                                                Unit Price
                                                            </p>

                                                            <p className="font-bold text-slate-700 mt-1">
                                                                ₹
                                                                {Number(
                                                                    item.product?.price || 0
                                                                ).toLocaleString("en-IN")}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                                {/* PRICE */}

                                                <div className="sm:text-right sm:self-center">

                                                    <p className="text-xs text-slate-400">
                                                        Item Total
                                                    </p>

                                                    <p className="text-xl font-black text-slate-900 mt-1">
                                                        ₹
                                                        {(
                                                            (item.product?.price || 0) *
                                                            item.quantity
                                                        ).toLocaleString("en-IN")}
                                                    </p>

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </main>

        </div>
    );
}

export default Orders;