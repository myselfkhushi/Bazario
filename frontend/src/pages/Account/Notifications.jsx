import React, { useState } from "react";
import toast from "react-hot-toast";
import { Bell, Package, Tag, ShieldCheck, CheckCheck, Clock } from "lucide-react";
import AccountSidebar from "../../component/account/AccountSidebar.jsx";

const DUMMY_NOTIFICATIONS = [
  {
    id: "n1",
    type: "order",
    title: "Order Shipped & Out for Delivery",
    message: "Your Bazario package has been handed over to BlueDart express courier. Delivery expected by 7:00 PM today.",
    time: "2 hours ago",
    isRead: false,
  },
  {
    id: "n2",
    type: "offer",
    title: "Price Drop Alert on your Wishlist!",
    message: "An item in your wishlist is now on a 25% limited-time flash discount.",
    time: "Yesterday",
    isRead: false,
  },
  {
    id: "n3",
    type: "system",
    title: "Account Security Verified",
    message: "Your login from Chrome on Windows was authenticated successfully.",
    time: "2 days ago",
    isRead: true,
  },
  {
    id: "n4",
    type: "offer",
    title: "SuperCoins Credited!",
    message: "+4 SuperCoins credited to your wallet for your recent completed order.",
    time: "3 days ago",
    isRead: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(DUMMY_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    toast.success("All notifications marked as read!");
  };

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.isRead;
    if (filter === "orders") return n.type === "order";
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">
            Communication Hub
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Notifications & Alerts
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated with your order statuses, price drop alerts, and exclusive sale vouchers.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeTab="notifications" />

          <main className="flex-1 space-y-6">
            
            {/* Top Toolbar */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {["all", "unread", "orders"].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setFilter(t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition cursor-pointer ${
                      filter === t
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={markAllRead}
                className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all as read
              </button>
            </div>

            {/* Notifications Feed */}
            <div className="space-y-3">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-5 border transition-all flex items-start gap-4 ${
                    !item.isRead ? "border-purple-200 bg-purple-50/20" : "border-slate-200/80"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      item.type === "order"
                        ? "bg-blue-50 text-blue-600"
                        : item.type === "offer"
                        ? "bg-amber-50 text-amber-600"
                        : "bg-purple-50 text-purple-600"
                    }`}
                  >
                    {item.type === "order" ? <Package className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="text-sm font-bold text-slate-900 truncate">{item.title}</h4>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0 font-medium">
                        <Clock className="w-3 h-3" />
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
