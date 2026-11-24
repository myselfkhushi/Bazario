import React from "react";
import toast from "react-hot-toast";
import { Ticket, Copy, CheckCircle2, Clock, Sparkles } from "lucide-react";
import AccountSidebar from "../../component/account/AccountSidebar.jsx";

const AVAILABLE_COUPONS = [
  {
    code: "WELCOME10",
    discount: "10% Instant OFF",
    title: "Welcome to Bazario Discount",
    description: "Get 10% instant discount on your first order across all categories.",
    minOrder: "₹499",
    expiry: "31 Dec 2026",
    badge: "Exclusive",
  },
  {
    code: "FESTIVE20",
    discount: "20% OFF up to ₹500",
    title: "Mega Season Flash Savings",
    description: "Applicable on Fashion, Footwear, Watches, and Accessories.",
    minOrder: "₹1,499",
    expiry: "15 Jan 2027",
    badge: "Trending",
  },
  {
    code: "FREESHIP",
    discount: "100% Free Express Delivery",
    title: "Zero Shipping Cost Coupon",
    description: "Enjoy zero shipping charges on orders with prepaid payment or COD.",
    minOrder: "₹299",
    expiry: "Unlimited",
    badge: "Popular",
  },
  {
    code: "BAZARIO50",
    discount: "Flat ₹50 Instant Cashback",
    title: "Weekend Shopping Bonanza",
    description: "Flat ₹50 deducted automatically at checkout on Electronics and Home products.",
    minOrder: "₹999",
    expiry: "28 Feb 2027",
    badge: "Verified",
  },
];

export default function Coupons() {
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon "${code}" copied to clipboard!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">
            Offers & Rewards
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Available Coupons & Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Apply these coupons at checkout to unlock instant discounts and free delivery.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeTab="coupons" />

          <main className="flex-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-purple-600" />
                  Active Coupons ({AVAILABLE_COUPONS.length})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Click on any code to copy it directly to your clipboard.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {AVAILABLE_COUPONS.map((coupon) => (
                <div
                  key={coupon.code}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200 mb-2">
                        {coupon.badge}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900">{coupon.title}</h3>
                      <p className="text-xs text-purple-700 font-extrabold mt-0.5">{coupon.discount}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(coupon.code)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-mono font-black border border-purple-200 transition cursor-pointer shrink-0"
                      title="Copy coupon code"
                    >
                      <span>{coupon.code}</span>
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-4">
                    {coupon.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Min Order: <strong className="text-slate-700">{coupon.minOrder}</strong></span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Expires: {coupon.expiry}
                    </span>
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
