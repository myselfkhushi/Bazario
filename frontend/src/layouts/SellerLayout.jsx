import { useState, useRef, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
    LayoutDashboard,
    Package,
    PlusCircle,
    ShoppingBag,
    User,
    LogOut,
    ChevronDown,
    Store,
    Sparkles
} from "lucide-react";

import { logoutUser } from "../features/auth/authAPI";
import { logout } from "../features/auth/authSlice";

export default function SellerLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const [openProfile, setOpenProfile] = useState(false);
    const profileRef = useRef(null);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setOpenProfile(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutUser();
            localStorage.removeItem("token");
            dispatch(logout());
            toast.success("Signed out successfully");
            navigate("/login");
        } catch (error) {
            localStorage.removeItem("token");
            dispatch(logout());
            navigate("/login");
        }
    };

    const navTabs = [
        { path: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { path: "/seller/add-product", label: "Add Product", icon: PlusCircle },
        { path: "/seller/products", label: "My Products", icon: Package },
        // { path: "/seller/orders", label: "Orders", icon: ShoppingBag },
    ];

    const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "S";

    return (
        <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 flex flex-col">
            {/* Top Seller Navbar */}
            <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
                    {/* Left: Brand & Seller Hub Badge */}
                    <div className="flex items-center gap-3">
                        <Link to="/seller/dashboard" className="flex items-center gap-2 group">
                            <span className="text-2xl font-black tracking-tight text-slate-950 uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                                BAZARIO<span className="text-purple-600">.</span>
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/70">
                                <Sparkles className="w-3 h-3 text-purple-600" />
                                Seller Hub
                            </span>
                        </Link>
                    </div>

                    {/* Right: Navigation Tabs + Profile */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {/* Nav Tabs */}
                        <nav className="flex items-center gap-1 sm:gap-2">
                            {navTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = location.pathname === tab.path;

                                return (
                                    <Link
                                        key={tab.path}
                                        to={tab.path}
                                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                                            isActive
                                                ? "bg-purple-600 text-white shadow-xs"
                                                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                                        }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{tab.label}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Divider */}
                        <div className="h-6 w-px bg-slate-200" />

                        {/* Profile Dropdown */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setOpenProfile(!openProfile)}
                                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer border border-transparent hover:border-slate-200"
                            >
                                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs">
                                    {userInitial}
                                </div>
                                <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-[100px] truncate">
                                    {user?.name || "Seller"}
                                </span>
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {/* Dropdown Menu */}
                            {openProfile && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-[fadeIn_0.15s_ease-out]">
                                    {/* User Info Header */}
                                    <div className="px-4 py-3 border-b border-slate-100">
                                        <p className="text-xs font-bold text-slate-900 truncate">
                                            {user?.name || "Seller"}
                                        </p>
                                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                                            {user?.email || "seller@bazario.com"}
                                        </p>
                                        <span className="inline-block mt-2 px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-black rounded-md uppercase tracking-wider">
                                            Verified Seller
                                        </span>
                                    </div>

                                    {/* Profile Actions */}
                                    <div className="p-1 space-y-0.5">
                                        <Link
                                            to="/profile"
                                            onClick={() => setOpenProfile(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                                        >
                                            <User className="w-4 h-4 text-slate-400" />
                                            Seller Profile
                                        </Link>

                                        <Link
                                            to="/"
                                            onClick={() => setOpenProfile(false)}
                                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                                        >
                                            <Store className="w-4 h-4 text-slate-400" />
                                            Customer Store View
                                        </Link>
                                    </div>

                                    <div className="p-1 border-t border-slate-100 mt-1">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4 text-rose-500" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Page Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
