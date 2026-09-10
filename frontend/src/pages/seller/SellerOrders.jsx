import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    FaBoxOpen,
    FaCheckCircle,
    FaClock,
    FaTruck,
    FaUser,
    FaEnvelope,
    FaReceipt,
    FaStore,
} from "react-icons/fa";

import {
    getSellerOrders,
} from "../../features/seller/sellerSlice";

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
                return "bg-emerald-50 text-emerald-600 border-emerald-100";

            case "Shipped":
                return "bg-blue-50 text-blue-600 border-blue-100";

            case "Processing":
                return "bg-indigo-50 text-indigo-600 border-indigo-100";

            case "Pending":
                return "bg-amber-50 text-amber-600 border-amber-100";

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
                        Loading seller orders...
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

                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">

                        <div>

                            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-indigo-600">

                                <FaStore size={12} />

                                Seller Dashboard

                            </div>

                            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
                                Orders
                            </h1>

                            <p className="text-slate-500 mt-3">
                                Manage orders containing your products.
                            </p>

                        </div>

                        {/* ORDER COUNT */}

                        <div className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4">

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

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-5 py-4 rounded-xl">
                        {error}
                    </div>
                )}

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
                                Orders containing your products will
                                appear here.
                            </p>

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

                                    <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

                                        {/* ORDER */}

                                        <div>

                                            <div className="flex items-center gap-2 text-indigo-300 text-xs uppercase tracking-wider font-bold">

                                                <FaReceipt />

                                                Order

                                            </div>

                                            <p className="text-white font-bold mt-2 break-all">
                                                #{order._id}
                                            </p>

                                        </div>

                                        {/* CUSTOMER */}

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300">

                                                <FaUser />

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400 uppercase tracking-wider">
                                                    Customer
                                                </p>

                                                <p className="text-white font-semibold mt-1">
                                                    {order.user?.name ||
                                                        "Unknown Customer"}
                                                </p>

                                            </div>

                                        </div>

                                        {/* TOTAL */}

                                        <div>

                                            <p className="text-xs text-slate-400 uppercase tracking-wider">
                                                Order Total
                                            </p>

                                            <p className="text-2xl font-black text-white mt-1">
                                                ₹
                                                {Number(
                                                    order.totalamount || 0
                                                ).toLocaleString("en-IN")}
                                            </p>

                                        </div>

                                        {/* STATUS */}

                                        <span
                                            className={`inline-flex w-fit items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${getStatusStyle(
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

                                {/* CUSTOMER INFORMATION */}

                                <div className="px-6 sm:px-8 py-5 border-b border-slate-100">

                                    <div className="flex flex-wrap gap-6">

                                        <div className="flex items-center gap-3">

                                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">

                                                <FaUser size={13} />

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Customer Name
                                                </p>

                                                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                                                    {order.user?.name ||
                                                        "N/A"}
                                                </p>

                                            </div>

                                        </div>

                                        <div className="flex items-center gap-3">

                                            <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">

                                                <FaEnvelope size={13} />

                                            </div>

                                            <div>

                                                <p className="text-xs text-slate-400">
                                                    Email
                                                </p>

                                                <p className="text-sm font-semibold text-slate-700 mt-0.5">
                                                    {order.user?.email ||
                                                        "N/A"}
                                                </p>

                                            </div>

                                        </div>

                                    </div>

                                </div>

                                {/* PRODUCTS */}

                                <div className="p-6 sm:p-8">

                                    <div className="flex items-center justify-between mb-5">

                                        <div>

                                            <h2 className="text-lg font-extrabold text-slate-900">
                                                Ordered Products
                                            </h2>

                                            <p className="text-sm text-slate-400 mt-1">
                                                Products included in this order
                                            </p>

                                        </div>

                                    </div>

                                    <div className="space-y-4">

                                        {order.orderitem?.map((item) => (

                                            <div
                                                key={item._id}
                                                className="border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:border-indigo-200 hover:shadow-md transition"
                                            >

                                                {/* IMAGE */}

                                                <div className="w-full sm:w-28 h-28 rounded-xl bg-slate-100 overflow-hidden shrink-0">

                                                    <img
                                                        src={
                                                            item.product?.images?.[0]?.url ||
                                                            "/placeholder-product.png"
                                                        }
                                                        alt={
                                                            item.product?.title ||
                                                            "Product"
                                                        }
                                                        className="w-full h-full object-cover"
                                                    />

                                                </div>

                                                {/* DETAILS */}

                                                <div className="flex-1">

                                                    <p className="text-xs uppercase tracking-wider font-bold text-indigo-500">
                                                        {item.product?.category ||
                                                            "Product"}
                                                    </p>

                                                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                                                        {item.product?.title ||
                                                            "Product unavailable"}
                                                    </h3>

                                                    <div className="flex flex-wrap gap-6 mt-5">

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
                                                                    item.product?.price ||
                                                                        0
                                                                ).toLocaleString(
                                                                    "en-IN"
                                                                )}
                                                            </p>

                                                        </div>

                                                    </div>

                                                </div>

                                                {/* ITEM TOTAL */}

                                                <div className="sm:self-center sm:text-right">

                                                    <p className="text-xs text-slate-400">
                                                        Item Total
                                                    </p>

                                                    <p className="text-xl font-black text-slate-900 mt-1">
                                                        ₹
                                                        {(
                                                            (item.product?.price ||
                                                                0) *
                                                            item.quantity
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
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

export default SellerOrders;