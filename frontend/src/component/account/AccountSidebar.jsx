import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  User,
  Package,
  Ticket,
  Coins,
  Sparkles,
  CreditCard,
  MapPin,
  Heart,
  Gift,
  Bell,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { logoutUser } from "../../features/auth/authAPI";
import { logout } from "../../features/auth/authSlice";

export default function AccountSidebar({ activeTab }) {
  const { user } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      toast.error("Logout failed");
    }
  };

  const menuItems = [
    { label: "My Profile", path: "/profile", icon: User, key: "profile" },
    { label: "Orders", path: "/orders", icon: Package, key: "orders" },
    { label: "Coupons", path: "/account/coupons", icon: Ticket, key: "coupons" },
    { label: "Supercoin", path: "/account/supercoin", icon: Coins, key: "supercoin" },
    { label: "Bazario Plus Zone", path: "/account/plus", icon: Sparkles, key: "plus", highlight: true },
    { label: "Saved Cards & Wallet", path: "/account/wallet", icon: CreditCard, key: "wallet" },
    { label: "Saved Addresses", path: "/account/addresses", icon: MapPin, key: "addresses" },
    { label: "Wishlist", path: "/wishlist", icon: Heart, key: "wishlist", badge: wishlist?.length },
    { label: "Gift Cards", path: "/account/gift-cards", icon: Gift, key: "gift-cards" },
    { label: "Notifications", path: "/account/notifications", icon: Bell, key: "notifications" },
  ];

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-4">
      {/* User Greeting Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center text-lg font-black uppercase shrink-0 ring-4 ring-slate-100">
          {user?.name?.[0] || "U"}
        </div>
        <div className="overflow-hidden">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hello,</p>
          <h3 className="text-sm sm:text-base font-black text-slate-900 truncate">
            {user?.name || "Bazario Shopper"}
          </h3>
          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Navigation Options List (Flipkart Account Style) */}
      <nav className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden divide-y divide-slate-100">
        <div className="p-2 space-y-0.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.key && activeTab === item.key);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all group ${
                  isActive
                    ? "bg-purple-600 text-white font-bold shadow-xs"
                    : item.highlight
                    ? "text-purple-700 hover:bg-purple-50 font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-purple-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive
                        ? "text-white"
                        : item.highlight
                        ? "text-purple-600"
                        : "text-slate-400 group-hover:text-purple-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive ? "bg-white text-purple-700" : "bg-rose-100 text-rose-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-purple-200" : "text-slate-300 group-hover:text-slate-500"
                    }`}
                  />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Sign Out CTA */}
        <div className="p-2">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </nav>

      {/* Trust & Guarantee Banner */}
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <p className="text-[11px] text-slate-500 leading-snug">
          100% Purchase Protection with Bazario Genuine Guarantee & Easy Doorstep Returns.
        </p>
      </div>
    </aside>
  );
}
