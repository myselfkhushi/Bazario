import React from "react";
import toast from "react-hot-toast";
import { Coins, Sparkles, ArrowUpRight, Gift, Trophy, ShieldCheck, CheckCircle2 } from "lucide-react";
import AccountSidebar from "../../component/account/AccountSidebar.jsx";

export default function Supercoin() {
  const coinBalance = 150;

  const handleRedeem = (reward) => {
    toast.success(`Redeemed "${reward}" voucher with SuperCoins! Check your email for details.`);
  };

  const REWARD_ITEMS = [
    {
      title: "Flat ₹100 Off on Next Order",
      coins: 50,
      description: "Valid across Fashion, Mobiles, and Electronics with no minimum basket value.",
    },
    {
      title: "Free Express Shipping Pass (3 Months)",
      coins: 40,
      description: "Enjoy zero delivery fees on all orders delivered anywhere across India.",
    },
    {
      title: "1-Month Bazario Plus Membership",
      coins: 100,
      description: "Unlock early bird access to festive flash sales and 2x SuperCoin earnings.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">
            Loyalty Program
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            SuperCoin Zone
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Earn coins on every rupee spent and redeem them for instant discounts, flight vouchers, and plus perks.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeTab="supercoin" />

          <main className="flex-1 space-y-6">
            
            {/* Balance Card (Flipkart Supercoin style) */}
            <div className="bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black uppercase tracking-wider mb-3">
                  <Coins className="w-3.5 h-3.5" />
                  Your Active Balance
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">{coinBalance}</span>
                  <span className="text-lg font-bold text-amber-100">SuperCoins</span>
                </div>
                <p className="text-xs sm:text-sm text-amber-100 max-w-md">
                  1 SuperCoin = ₹1.00 Value. Use up to 100% coins to pay for purchases at checkout.
                </p>
              </div>

              {/* Decorative coins graphic overlay */}
              <div className="absolute right-6 -bottom-6 opacity-20 pointer-events-none">
                <Coins className="w-44 h-44 text-white" />
              </div>
            </div>

            {/* How to Earn */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-purple-600" />
                How You Earn SuperCoins
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-900">2 Coins per ₹100</p>
                  <p className="text-[11px] text-slate-500 mt-1">Standard shoppers earn up to 50 coins per order.</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
                  <p className="text-xs font-bold text-purple-900">4 Coins per ₹100 (Plus)</p>
                  <p className="text-[11px] text-purple-700 mt-1">Bazario Plus members earn double coins up to 100 per order.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-xs font-bold text-slate-900">Review & Refer</p>
                  <p className="text-[11px] text-slate-500 mt-1">Get 10 bonus coins for every verified photo review posted.</p>
                </div>
              </div>
            </div>

            {/* Supercoin Rewards Store */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Gift className="w-4 h-4 text-purple-600" />
                Redeem Coins for Rewards
              </h3>

              <div className="space-y-3">
                {REWARD_ITEMS.map((reward, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-200/80 hover:border-purple-300 transition-colors gap-3"
                  >
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{reward.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">{reward.description}</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRedeem(reward.title)}
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-purple-600 text-white text-xs font-bold transition cursor-pointer shrink-0"
                    >
                      <Coins className="w-3.5 h-3.5 text-amber-400" />
                      <span>{reward.coins} Coins</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
