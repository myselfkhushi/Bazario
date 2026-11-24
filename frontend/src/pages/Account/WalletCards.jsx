import React, { useState } from "react";
import toast from "react-hot-toast";
import { CreditCard, Wallet, ShieldCheck, Plus, Check, Lock, Smartphone, X } from "lucide-react";
import AccountSidebar from "../../component/account/AccountSidebar.jsx";

export default function WalletCards() {
  const [walletBalance, setWalletBalance] = useState(750.0);
  const [showAddCard, setShowAddCard] = useState(false);

  const [savedCards, setSavedCards] = useState([
    {
      id: "c1",
      bank: "HDFC Bank",
      cardType: "Visa Signature",
      lastFour: "4829",
      holder: "Bazario Customer",
      expiry: "09/28",
      color: "from-blue-900 to-indigo-950",
    },
    {
      id: "c2",
      bank: "ICICI Bank",
      cardType: "MasterCard World",
      lastFour: "8912",
      holder: "Bazario Customer",
      expiry: "11/29",
      color: "from-amber-900 to-stone-900",
    },
  ]);

  const [upiIds, setUpiIds] = useState(["user@okaxis", "shopper@oksbi"]);
  const [newUpi, setNewUpi] = useState("");

  const handleAddUPI = (e) => {
    e.preventDefault();
    if (!newUpi.trim() || !newUpi.includes("@")) {
      toast.error("Please enter a valid VPA / UPI ID (e.g. mobile@upi)");
      return;
    }
    setUpiIds([...upiIds, newUpi.trim()]);
    setNewUpi("");
    toast.success("UPI ID saved for fast 1-click payment!");
  };

  const handleAddMoney = () => {
    toast.success("Wallet recharge portal opened! Instant cashback will be applied.");
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Breadcrumb */}
        <div className="mb-6 sm:mb-8">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">
            Payment Methods
          </p>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Saved Cards & Wallet
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your digital wallet balance, encrypted cards, and UPI IDs with bank-grade 256-bit security.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <AccountSidebar activeTab="wallet" />

          <main className="flex-1 space-y-6">
            
            {/* Bazario Wallet Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Bazario Digital Balance
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    ₹{walletBalance.toFixed(2)}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Use balance for instant 1-second refunds & checkouts.</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddMoney}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add Money
              </button>
            </div>

            {/* Saved Credit / Debit Cards */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                    Saved Cards ({savedCards.length})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">Card numbers are tokenized in compliance with RBI guidelines.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {savedCards.map((card) => (
                  <div
                    key={card.id}
                    className={`rounded-2xl p-5 bg-gradient-to-br ${card.color} text-white shadow-md flex flex-col justify-between h-44 relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">{card.bank}</span>
                      <span className="text-xs font-black italic">{card.cardType}</span>
                    </div>

                    <div className="my-auto">
                      <p className="text-lg font-mono tracking-widest font-black">
                        •••• •••• •••• {card.lastFour}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-300">
                      <span>{card.holder}</span>
                      <span>Expires: {card.expiry}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved UPI Handles */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-purple-600" />
                Linked UPI IDs
              </h3>

              <div className="space-y-2 mb-4">
                {upiIds.map((vpa, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono font-bold text-slate-800"
                  >
                    <span>{vpa}</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-sans font-bold">
                      Verified
                    </span>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddUPI} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add new UPI ID (e.g. mobile@upi)"
                  value={newUpi}
                  onChange={(e) => setNewUpi(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-purple-500 !outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-slate-900 hover:bg-purple-600 text-white text-xs font-bold rounded-xl transition cursor-pointer"
                >
                  Link UPI
                </button>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
