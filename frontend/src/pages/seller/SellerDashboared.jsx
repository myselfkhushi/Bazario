import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PackageOpen, ShoppingBag, Banknote, AlertTriangle } from "lucide-react";
import { getSellerDashboard } from "../../features/seller/sellerSlice";

function SellerDashboared() {
    const dispatch = useDispatch();
    const { dashboard, loading, error } = useSelector((state) => state.seller);

    useEffect(() => {
        dispatch(getSellerDashboard());
    }, [dispatch]);

    const cards = [
        {
            title: "Total Products",
            value: dashboard.totalProducts || 0,
            icon: <PackageOpen className="w-6 h-6" />,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Total Orders",
            value: dashboard.totalOrders || 0,
            icon: <ShoppingBag className="w-6 h-6" />,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Total Revenue",
            value: `₹${(dashboard.totalRevenue || 0).toLocaleString("en-IN")}`,
            icon: <Banknote className="w-6 h-6" />,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Low Stock",
            value: dashboard.lowStockProducts || 0,
            icon: <AlertTriangle className="w-6 h-6" />,
            color: "text-rose-600",
            bg: "bg-rose-50"
        },
    ];

    return (
        <div className="font-sans text-slate-900">
            {/* Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                    Overview
                </h1>
                <p className="text-slate-500 text-sm mt-2 font-medium">
                    Monitor your store's performance and recent activity.
                </p>
            </div>

            {/* Bento Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-3xl p-6 flex flex-col justify-between shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-8">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${card.bg} ${card.color}`}>
                                {card.icon}
                            </div>
                        </div>
                        <div>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{card.title}</p>
                            <h2 className="text-3xl font-black tracking-tight">{card.value}</h2>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm mt-10 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-black tracking-tight">Recent Orders</h2>
                    <button className="text-xs font-bold text-purple-600 hover:text-purple-700 uppercase tracking-widest transition-colors">
                        View All
                    </button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-[10px] uppercase tracking-widest text-slate-500 font-black border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-4 rounded-tl-lg">Customer</th>
                                <th className="px-8 py-4">Product</th>
                                <th className="px-8 py-4">Quantity</th>
                                <th className="px-8 py-4">Status</th>
                                <th className="px-8 py-4 text-right rounded-tr-lg">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {dashboard.recentOrders?.length > 0 ? (
                                dashboard.recentOrders.map((order) => (
                                    <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-8 py-5 font-bold text-slate-900">{order.user?.name || "Guest"}</td>
                                        <td className="px-8 py-5 text-slate-600 font-medium">
                                            <div className="max-w-[200px] truncate">
                                                {order.orderitem[0]?.product?.title || "Product"}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-slate-600 font-medium">{order.orderitem[0]?.quantity}</td>
                                        <td className="px-8 py-5">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                                order.orderstatus === 'DELIVERED' 
                                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                : order.orderstatus === 'SHIPPED'
                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                : 'bg-slate-100 text-slate-700 border-slate-200'
                                            }`}>
                                                {order.orderstatus}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 font-black text-slate-900 text-right">
                                            ₹{order.totalamount.toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-16 text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-50 mb-4">
                                            <ShoppingBag className="w-8 h-8 text-slate-400" />
                                        </div>
                                        <p className="text-slate-900 font-bold mb-1">No recent orders</p>
                                        <p className="text-slate-500 text-sm">When you receive orders, they will appear here.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default SellerDashboared;