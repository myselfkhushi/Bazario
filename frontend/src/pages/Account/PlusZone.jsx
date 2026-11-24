import React from "react";
import toast from "react-hot-toast";
import { Sparkles, Truck, Coins, Flame, Headphones, ShieldCheck, Check } from "lucide-react";
import AccountSidebar from "../../component/account/AccountSidebar.jsx";

export default function PlusZone() {
  const handleUpgrade = () => {
    toast.success("Welcome to Bazario Plus Zone! Free Express Delivery activated on your account.");
  };

  const BENEFITS = [
    {
      icon: Truck,
      title: "Free Express Delivery",
      description: "No minimum purchase requirement. Get your orders delivered in 24 to 48 hours for free.",
    },
    {
      icon: Coins,
      title: "2X SuperCoin Earnings",
      description: "Earn 4 SuperCoins per ₹100 spent (double the standard rate) on all catalog items.",
    },
    {
      icon: Flame,
      title: "Early Access to Big Sales",
      description: "Shop 24 hours before everyone else during Black Friday, Diwali, and Mega Flash events.",
    },
    {
      icon: Headphones,
      title: "VIP 24x7 Priority Support",
      description: "Dedicated account manager and zero-queue hotline for returns and customer care.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">
            VIP Membership
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bazario Plus Zone
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Our premium loyalty tier packed with zero delivery charges, double coins, and early sale privileges.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeTab="plus" />

          <main className="flex-1 space-y-6">
            
            {/* VIP Status Card */}
            <div className="bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-4">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  Bazario Plus Member
                </div>

                <h2 className="text-2xl sm:text-3xl font-black mb-2">
                  Enjoy Unlimited Benefits
                </h2>
                <p className="text-xs sm:text-sm text-purple-200 max-w-lg mb-6">
                  Your Plus membership is currently ACTIVE. Enjoy free shipping on all orders and double SuperCoins at checkout!
                </p>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold">
                    Expires: <span className="text-amber-300 font-black">31 Dec 2027</span>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                    <span>Free Shipping Active</span>
                  </div>
                </div>
              </div>

              {/* Decorative sparkle */}
              <div className="absolute right-4 -bottom-8 opacity-15 pointer-events-none">
                <Sparkles className="w-56 h-56 text-white" />
              </div>
            </div>

            {/* Core Plus Perks Grid */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-6">
                Your Exclusive Plus Privileges
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {BENEFITS.map((b, idx) => {
                  const Icon = b.icon;
                  return (
                    <div
                      key={idx}
                      className="p-4 sm:p-5 rounded-2xl bg-purple-50/40 border border-purple-100 flex items-start gap-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-1">{b.title}</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">{b.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
