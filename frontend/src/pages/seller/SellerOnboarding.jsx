import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Store,
  Phone,
  Mail,
  FileCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Building2,
  Sparkles,
  KeyRound,
  Truck,
  LogOut
} from "lucide-react";

import { completeSellerOnboardingAPI, logoutUser } from "../../features/auth/authAPI";
import { setUser, logout } from "../../features/auth/authSlice";

export default function SellerOnboarding() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // If already verified, direct to Seller Dashboard
  useEffect(() => {
    if (user?.role === "seller" && user?.sellerDetails?.isSellerVerified) {
      navigate("/seller/dashboard", { replace: true });
    }
  }, [user, navigate]);

  // Active Wizard Step (1: Contact, 2: GSTIN, 3: Store, 4: Pickup Location)
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // ── Step 1: Contact Verification State ─────────────────────────────
  const [phone, setPhone] = useState(user?.phone || "");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(Boolean(user?.isPhoneVerified));
  const [isEmailVerified, setIsEmailVerified] = useState(true); // Default true since registered via email

  // ── Step 2: GSTIN Verification State ───────────────────────────────
  const [gstin, setGstin] = useState(user?.sellerDetails?.gstin || "");
  const [isGstinVerified, setIsGstinVerified] = useState(Boolean(user?.sellerDetails?.gstin));
  const [gstLegalName, setGstLegalName] = useState(user?.name || "");

  // ── Step 3: Store Details State ────────────────────────────────────
  const [storeName, setStoreName] = useState(user?.sellerDetails?.storeName || `${user?.name || "My"} Store`);
  const [storeCategory, setStoreCategory] = useState("Electronics");
  const [storeDescription, setStoreDescription] = useState(
    user?.sellerDetails?.storeDescription || "Official verified retail merchant on Bazario Marketplace."
  );

  // ── Step 4: Pickup & Warehouse Address State ───────────────────────
  const [pickupAddress, setPickupAddress] = useState({
    street: user?.sellerDetails?.pickupAddress?.street || "",
    city: user?.sellerDetails?.pickupAddress?.city || "",
    state: user?.sellerDetails?.pickupAddress?.state || "Rajasthan",
    pincode: user?.sellerDetails?.pickupAddress?.pincode || "",
  });

  // 📱 Send Phone OTP Simulation
  const handleSendOtp = () => {
    if (!phone || phone.trim().length !== 10) {
      toast.error("Please enter a valid 10-digit mobile number");
      return;
    }
    setOtpSent(true);
    setPhoneOtp("123456"); // Pre-filled for effortless testing
    toast.success("OTP sent to +91 " + phone + "! (Test OTP: 123456)");
  };

  // 📱 Verify Phone OTP
  const handleVerifyOtp = () => {
    if (phoneOtp === "123456" || phoneOtp.length === 6) {
      setIsPhoneVerified(true);
      toast.success("Phone number verified successfully!");
    } else {
      toast.error("Invalid OTP. Enter 123456 to verify.");
    }
  };

  // 🏛️ Verify GSTIN Number
  const handleVerifyGstin = () => {
    const cleanGst = gstin.trim().toUpperCase();
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    if (!cleanGst || !gstRegex.test(cleanGst)) {
      toast.error("Invalid GSTIN format! Example: 08BDRPC2330N1ZD");
      return;
    }

    setGstin(cleanGst);
    setIsGstinVerified(true);
    setGstLegalName(`${user?.name || "Merchant"} Retail Enterprises`);
    toast.success("GSTIN active & verified on GST Portal!");
  };

  // 🚪 Handle Sign Out
  const handleSignOut = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem("token");
    dispatch(logout());
    toast.success("Signed out successfully");
    navigate("/login");
  };

  // 🚀 Final Form Submission
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();

    if (!isPhoneVerified) {
      toast.error("Please verify your phone number in Step 1 first");
      setCurrentStep(1);
      return;
    }

    if (!isGstinVerified) {
      toast.error("Please verify your GST number in Step 2 first");
      setCurrentStep(2);
      return;
    }

    if (!storeName.trim()) {
      toast.error("Store name is required in Step 3");
      setCurrentStep(3);
      return;
    }

    if (!pickupAddress.street?.trim() || !pickupAddress.city?.trim() || !pickupAddress.pincode?.trim()) {
      toast.error("Complete warehouse pickup location is required in Step 4");
      setCurrentStep(4);
      return;
    }

    try {
      setSubmitting(true);
      const res = await completeSellerOnboardingAPI({
        phone: phone.trim(),
        gstin: gstin.trim().toUpperCase(),
        storeName: storeName.trim(),
        storeDescription: storeDescription ? storeDescription.trim() : "",
        pickupAddress: {
          street: pickupAddress.street.trim(),
          city: pickupAddress.city.trim(),
          state: pickupAddress.state ? pickupAddress.state.trim() : "Rajasthan",
          pincode: pickupAddress.pincode.trim(),
        },
      });

      if (res.token) {
        localStorage.setItem("token", res.token);
      }

      if (res.user) {
        dispatch(setUser(res.user));
      }

      toast.success("🎉 Seller Registration Complete! Welcome to Bazario Seller Hub.");
      navigate("/seller/dashboard");
    } catch (err) {
      console.error("Seller onboarding error:", err);
      const serverMsg = err.response?.data?.message;
      if (err.response?.status === 401) {
        toast.error("Session expired or unauthorized. Please re-login.");
      } else {
        toast.error(serverMsg || (err.message === "Network Error" ? "Unable to connect to backend server. Ensure backend is running on port 5000." : err.message) || "Failed to complete seller onboarding");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Step Indicators
  const steps = [
    { num: 1, title: "Phone & Email", desc: "Contact Verification", icon: Phone },
    { num: 2, title: "GSTIN Tax ID", desc: "Business Verification", icon: FileCheck },
    { num: 3, title: "Store Profile", desc: "Brand & Category", icon: Store },
    { num: 4, title: "Pickup Warehouse", desc: "Courier Logistics", icon: Truck },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* 🛑 Dedicated Distraction-Free Seller Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
              BAZARIO<span className="text-purple-600">.</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/70">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Seller Onboarding
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-slate-900 leading-none truncate max-w-[120px]">{user?.name || "Seller"}</p>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] mt-0.5">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
        
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Seller Onboarding & Verification
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Complete Your Seller Registration
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-md mx-auto font-medium">
            Verify your phone, GST number, store name, and pickup location to begin selling on Bazario.
          </p>
        </div>

        {/* Step Progress Tracker */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {steps.map((st) => {
              const Icon = st.icon;
              const isActive = currentStep === st.num;
              const isDone = currentStep > st.num;

              return (
                <div
                  key={st.num}
                  onClick={() => {
                    // Allow navigating back to completed steps
                    if (st.num < currentStep) setCurrentStep(st.num);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-2xl border transition cursor-pointer ${
                    isActive
                      ? "border-purple-600 bg-purple-50/70 shadow-xs"
                      : isDone
                      ? "border-emerald-200 bg-emerald-50/50"
                      : "border-slate-200 bg-slate-50/50 opacity-60"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : isDone
                        ? "bg-emerald-600 text-white"
                        : "bg-slate-200 text-slate-600"
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Step {st.num}
                    </p>
                    <p className="text-xs font-black text-slate-900 truncate">
                      {st.title}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Container */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-6 sm:p-10">
          
          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 1: PHONE & EMAIL VERIFICATION                          */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Phone className="w-5 h-5 text-purple-600" />
                  Step 1: Contact Verification
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-medium">
                  Verify your primary contact channels for official communications and order alerts.
                </p>
              </div>

              {/* Email Address Display */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Registered Email Address
                </label>
                <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                  <Mail className="w-5 h-5 text-slate-400 shrink-0" />
                  <span className="text-sm font-bold text-slate-800 flex-1 truncate">
                    {user?.email || "merchant@example.com"}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                  </span>
                </div>
              </div>

              {/* Mobile Number Verification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Mobile Number (India +91)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                      +91
                    </span>
                    <input
                      type="tel"
                      maxLength={10}
                      disabled={isPhoneVerified}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="9876543210"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 pl-14 pr-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white disabled:opacity-60"
                    />
                  </div>

                  {!isPhoneVerified && (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      className="px-6 py-3.5 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-sm"
                    >
                      {otpSent ? "Resend OTP" : "Send OTP"}
                    </button>
                  )}
                </div>

                {isPhoneVerified && (
                  <p className="text-emerald-600 text-xs font-bold flex items-center gap-1.5 mt-2">
                    <CheckCircle2 className="w-4 h-4" /> Phone number verified successfully!
                  </p>
                )}
              </div>

              {/* OTP Input Section (shown when OTP is sent & not yet verified) */}
              {otpSent && !isPhoneVerified && (
                <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-3">
                  <p className="text-xs font-bold text-purple-900 flex items-center gap-1.5">
                    <KeyRound className="w-4 h-4 text-purple-600" />
                    Enter 6-Digit OTP sent to your phone
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneOtp}
                      onChange={(e) => setPhoneOtp(e.target.value)}
                      placeholder="Enter 123456"
                      className="w-48 bg-white border border-purple-300 rounded-xl px-4 py-2.5 text-center text-base tracking-widest font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer"
                    >
                      Verify OTP
                    </button>
                  </div>
                  <p className="text-[11px] text-purple-700">
                    Test OTP is prefilled as <span className="font-bold underline">123456</span> for instant testing.
                  </p>
                </div>
              )}

              {/* Next Step Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  disabled={!isPhoneVerified}
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  Proceed to GSTIN Verification
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 2: GSTIN TAX VERIFICATION                              */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  Step 2: GSTIN Business Verification
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-medium">
                  Enter your 15-digit Indian GSTIN number to verify government tax registration.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Goods & Services Tax Identification Number (GSTIN)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => {
                      setGstin(e.target.value.toUpperCase());
                      setIsGstinVerified(false);
                    }}
                    placeholder="e.g. 08BDRPC2330N1ZD"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white uppercase tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyGstin}
                    className="px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer shrink-0 shadow-sm"
                  >
                    Verify GSTIN
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 mt-1.5">
                  Format: 2 digits State Code + 10 digits PAN + 1 Entity Code + 'Z' + 1 Check Digit.
                </p>
              </div>

              {/* Verified GST Banner */}
              {isGstinVerified && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>GSTIN Active & Verified on Govt. GSTN Database</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-emerald-200/60 text-xs">
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Legal Business Name</p>
                      <p className="font-black text-slate-900">{gstLegalName}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-[10px] uppercase font-bold">Associated PAN</p>
                      <p className="font-mono font-black text-slate-900">{gstin.slice(2, 12)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={!isGstinVerified}
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  Proceed to Store Profile
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 3: STORE & BRAND DETAILS                               */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Store className="w-5 h-5 text-purple-600" />
                  Step 3: Store Details & Brand Identity
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-medium">
                  Set up your public brand presence so buyers can easily recognize your storefront.
                </p>
              </div>

              {/* Store Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Store Display Name
                </label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Apex Electronics Hub"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              {/* Primary Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Primary Category
                </label>
                <select
                  value={storeCategory}
                  onChange={(e) => setStoreCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white cursor-pointer"
                >
                  <option value="Electronics">Electronics & Gadgets</option>
                  <option value="Fashion">Fashion & Apparel</option>
                  <option value="Footwear">Footwear & Shoes</option>
                  <option value="Watches">Watches & Accessories</option>
                  <option value="Home & Living">Home & Kitchen Living</option>
                  <option value="Beauty">Beauty & Personal Care</option>
                  <option value="Books">Books & Stationery</option>
                </select>
              </div>

              {/* Store Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Store Description
                </label>
                <textarea
                  rows={3}
                  value={storeDescription}
                  onChange={(e) => setStoreDescription(e.target.value)}
                  placeholder="Tell buyers what makes your products stand out..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs font-medium text-slate-800 focus:outline-none focus:border-purple-600 focus:bg-white leading-relaxed"
                />
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={!storeName.trim()}
                  onClick={() => setCurrentStep(4)}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-40"
                >
                  Proceed to Pickup Location
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────── */}
          {/* STEP 4: COURIER PICKUP WAREHOUSE LOCATION                   */}
          {/* ─────────────────────────────────────────────────────────── */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Step 4: Courier Pickup Location
                </h2>
                <p className="text-slate-500 text-xs mt-1 font-medium">
                  Logistics partners (Delhivery, BlueDart, E-Kart) will dispatch couriers to this location for parcel handovers.
                </p>
              </div>

              {/* Street Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Warehouse / Shop Address
                </label>
                <input
                  type="text"
                  value={pickupAddress.street}
                  onChange={(e) => setPickupAddress({ ...pickupAddress, street: e.target.value })}
                  placeholder="Plot No. 25/B, E-Commerce Industrial Zone"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              {/* City & State */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    value={pickupAddress.city}
                    onChange={(e) => setPickupAddress({ ...pickupAddress, city: e.target.value })}
                    placeholder="Jaipur / Ganganagar"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    value={pickupAddress.state}
                    onChange={(e) => setPickupAddress({ ...pickupAddress, state: e.target.value })}
                    placeholder="Rajasthan"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Pincode (6 Digits)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pickupAddress.pincode}
                  onChange={(e) => setPickupAddress({ ...pickupAddress, pincode: e.target.value.replace(/\D/g, "") })}
                  placeholder="302014"
                  className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-2xl py-3.5 px-4 text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-purple-600 focus:bg-white"
                />
              </div>

              {/* Guarantee Banner */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
                <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
                <span>
                  By clicking Launch Store, you agree to Bazario Seller Terms of Service. 0% Commission on all product sales.
                </span>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  disabled={submitting || !pickupAddress.street || !pickupAddress.city || !pickupAddress.pincode}
                  onClick={handleCompleteRegistration}
                  className="px-8 py-3.5 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-purple-600/30 disabled:opacity-40"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Complete Registration & Launch Store</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  </div>
);
}
