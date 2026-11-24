import React, { useState } from "react";
import toast from "react-hot-toast";
import { Gift, Sparkles, Plus, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import AccountSidebar from "../../component/account/AccountSidebar.jsx";

export default function GiftCards() {
  const [giftCardBalance, setGiftCardBalance] = useState(0.0);
  const [cardNumber, setCardNumber] = useState("");
  const [cardPin, setCardPin] = useState("");

  const handleAddCard = (e) => {
    e.preventDefault();
    if (cardNumber.length < 16 || cardPin.length < 6) {
      toast.error("Please enter a valid 16-digit card number and 6-digit PIN.");
      return;
    }
    setGiftCardBalance((prev) => prev + 500);
    setCardNumber("");
    setCardPin("");
    toast.success("₹500.00 Gift Card added to your Bazario account balance!");
  };

  const handleBuyCard = (amount) => {
    toast.success(`Selected ₹${amount} Gift Card. Proceeding to checkout.`);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">
            Vouchers & Balance
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Bazario Gift Cards
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Send digital gift vouchers to friends & family or redeem cards directly into your shopping account.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeTab="gift-cards" />

          <main className="flex-1 space-y-6">
            
            {/* Active Balance Header */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Gift className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Total Gift Card Balance
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    ₹{giftCardBalance.toFixed(2)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Usable alongside SuperCoins and coupons on checkout.</p>
                </div>
              </div>
            </div>

            {/* Redeem a Gift Card Form */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-600" />
                Add a Gift Card to Account
              </h3>

              <form onSubmit={handleAddCard} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    16-Digit Card Number *
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="e.g. 6014 8291 0048 2910"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-purple-500 !outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    6-Digit Security PIN *
                  </label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="••••••"
                    value={cardPin}
                    onChange={(e) => setCardPin(e.target.value.replace(/\D/g, ""))}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-purple-500 !outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                >
                  Apply to Balance
                </button>
              </form>
            </div>

            {/* Buy a Gift Card for Someone */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                Buy a Gift Card
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[500, 1000, 2000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleBuyCard(amt)}
                    className="p-4 rounded-xl border border-slate-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-center cursor-pointer group"
                  >
                    <p className="text-lg font-black text-slate-900 group-hover:text-purple-600">₹{amt}</p>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-1">Instant Voucher</span>
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
