import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, Store } from "lucide-react";

function SellerLayout() {
    const location = useLocation();

    const navItems = [
        { path: "/seller/dashboard", icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard" },
        { path: "/seller/products", icon: <Package className="w-5 h-5" />, label: "My Products" },
        { path: "/seller/add-product", icon: <PlusCircle className="w-5 h-5" />, label: "Add Product" },
        { path: "/seller/orders", icon: <ShoppingBag className="w-5 h-5" />, label: "Orders" },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col shrink-0">
                <div className="p-6 border-b border-slate-100 mb-4">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                            B
                        </div>
                        <span className="text-xl font-black tracking-tight text-slate-900 uppercase">
                            Seller Hub
                        </span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1.5">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link 
                                key={item.path}
                                to={item.path} 
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                                    isActive 
                                    ? "bg-purple-50 text-purple-700" 
                                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                }`}
                            > 
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-slate-100">
                    <Link to="/" className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
                        <Store className="w-4 h-4" />
                        Back to Store
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 sm:p-12 h-screen overflow-y-auto">
                <div className="max-w-6xl mx-auto">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
}

export default SellerLayout;