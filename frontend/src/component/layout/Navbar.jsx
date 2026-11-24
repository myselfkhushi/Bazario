import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  ShoppingCart,
  Heart,
  User,
  Search,
  LogOut,
  Package,
  ClipboardList,
  LayoutDashboard,
  PlusCircle,
  ChevronDown,
  Menu,
  X,
  Store,
  Sparkles,
  ArrowRight,
  Ticket,
  Coins,
  CreditCard,
  MapPin,
  Gift,
  Bell,
  Headphones,
  Presentation,
  Tv,
  Smartphone,
  Shirt,
  Laptop,
  Baby,
  Dumbbell,
  BookOpen,
  Armchair,
  CheckCircle2,
} from "lucide-react";
import api from "../../api/axios";

import { logoutUser } from "../../features/auth/authAPI";
import { logout } from "../../features/auth/authSlice";

export default function Navbar() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { items: guestCart } = useSelector((state) => state.guestCart);
  const { items: guestWishlist } = useSelector((state) => state.guestWishlist);

  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Dropdown states
  const [openAccount, setOpenAccount] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const accountRef = useRef(null);
  const moreRef = useRef(null);
  const searchRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const activeCategoryParam = searchParams.get("category");

  // Route flags
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/seller/onboarding";

  // Item counts
  const cartCount = isAuthenticated ? (cart?.length ?? 0) : (guestCart?.length ?? 0);
  const wishlistCount = isAuthenticated ? (wishlist?.length ?? 0) : (guestWishlist?.length ?? 0);

  const handleLogout = async () => {
    try {
      await logoutUser();
      localStorage.removeItem("token");
      dispatch(logout());
      toast.success("Signed out successfully");
      navigate("/login");
      setOpenAccount(false);
    } catch (error) {
      localStorage.removeItem("token");
      dispatch(logout());
      toast.error("Logout failed");
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setOpenAccount(false);
      }
      if (moreRef.current && !moreRef.current.contains(e.target)) {
        setOpenMore(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
    setShowSuggestions(false);
    setOpenAccount(false);
    setOpenMore(false);
  }, [location]);

  // Live Search Suggestions (Debounced)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!search.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        setIsSearching(true);
        const res = await api.get(`/products?keyword=${encodeURIComponent(search.trim())}&limit=5`);
        setSuggestions(res.data.products || []);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 250);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?keyword=${encodeURIComponent(search.trim())}`);
    }
  };

  // Generic handler for mock interactive perks (Coupons, SuperCoins, etc.)
  const handleFeatureNotice = (featureName, message) => {
    toast((t) => (
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
        <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
        <span>{message}</span>
      </div>
    ), { duration: 3500 });
    setOpenAccount(false);
    setOpenMore(false);
  };

  // =========================================================================
  // 🛑 SPECIAL SELLER NAVBAR: When logged in as Seller, replace customer navbar!
  // =========================================================================
  if (isAuthenticated && user?.role === "seller") {
    const sellerInitial = user?.name ? user.name.charAt(0).toUpperCase() : "S";

    const sellerTabs = [
      { path: "/seller/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { path: "/seller/add-product", label: "Add Product", icon: PlusCircle },
      { path: "/seller/products", label: "My Products", icon: Package },
      { path: "/seller/orders", label: "Orders", icon: ShoppingBag },
    ];

    return (
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Logo & Seller Hub Badge */}
            <div className="flex items-center gap-3">
              <Link to="/seller/dashboard" className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                  BAZARIO<span className="text-purple-600">.</span>
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200/70">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  Seller Hub
                </span>
              </Link>
            </div>

            {/* Right: Seller Tabs + Profile Icon */}
            <div className="flex items-center gap-2 sm:gap-4">
              <nav className="flex items-center gap-1 sm:gap-2">
                {sellerTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = location.pathname === tab.path || (tab.path === "/seller/dashboard" && location.pathname === "/");

                  return (
                    <Link
                      key={tab.path}
                      to={tab.path}
                      className={`flex items-center gap-1.5 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                        isActive
                          ? "bg-purple-600 text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="h-6 w-px bg-slate-200" />

              {/* Profile Icon with Dropdown */}
              <div className="relative" ref={accountRef}>
                <button
                  onClick={() => setOpenAccount(!openAccount)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl hover:bg-slate-100 transition cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shadow-xs uppercase">
                    {sellerInitial}
                  </div>
                  <span className="hidden md:inline text-xs font-bold text-slate-800 max-w-[90px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {openAccount && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{user?.email}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-purple-50 text-purple-700 text-[10px] font-black rounded-md uppercase tracking-wider">
                        Verified Seller
                      </span>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link
                        to="/profile"
                        onClick={() => setOpenAccount(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        Seller Profile
                      </Link>
                    </div>

                    <div className="p-1 border-t border-slate-100 mt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // =========================================================================
  // 🛍️ FLIPKART-STYLE BUYER / CUSTOMER NAVBAR (Images 2, 3, 4)
  // =========================================================================
  
  // Horizontal Category Strip with Icons (Image 2 & Image 4)
  const navCategories = [
    { label: "For You", categoryName: null, path: "/shop", icon: Sparkles },
    { label: "Fashion", categoryName: "Fashion", path: "/shop?category=Fashion", icon: Shirt },
    { label: "Mobiles", categoryName: "Mobiles", path: "/shop?category=Mobiles", icon: Smartphone },
    { label: "Electronics", categoryName: "Electronics", path: "/shop?category=Electronics", icon: Laptop },
    { label: "Beauty", categoryName: "Beauty", path: "/shop?category=Beauty", icon: Sparkles },
    { label: "Home", categoryName: "Home & Living", path: "/shop?category=Home & Living", icon: Armchair },
    { label: "Appliances", categoryName: "Appliances", path: "/shop?category=Appliances", icon: Tv },
    { label: "Toys", categoryName: "Toys", path: "/shop?category=Toys", icon: Baby },
    { label: "Sports", categoryName: "Sports", path: "/shop?category=Sports", icon: Dumbbell },
    { label: "Books", categoryName: "Books", path: "/shop?category=Books", icon: BookOpen },
    { label: "Furniture", categoryName: "Furniture", path: "/shop?category=Furniture", icon: Armchair },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/80 shadow-xs">
      {/* ── Main Flipkart-Style Top Header (Image 2) ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
          
          {/* Brand Logo & Mobile Drawer Button */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="flex items-center gap-1.5 group">
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans group-hover:text-purple-600 transition-colors">
                BAZARIO<span className="text-purple-600">.</span>
              </span>
            </Link>
          </div>

          {/* Flipkart-Style Wide Search Bar: "Search for Products, Brands and More" */}
          {!isAuthPage && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-auto relative" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <div className="flex items-center bg-slate-50 hover:bg-slate-100 focus-within:bg-white rounded-xl border border-slate-200 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-100 transition-all overflow-hidden h-11 px-4 shadow-2xs">
                  <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onFocus={() => {
                      if (suggestions.length > 0) setShowSuggestions(true);
                    }}
                    placeholder="Search for Products, Brands and More"
                    className="w-full h-full text-[13px] bg-transparent text-slate-900 placeholder-slate-400 font-medium !outline-none !ring-0 !border-none !shadow-none"
                    style={{ boxShadow: "none" }}
                  />
                  {isSearching ? (
                    <div className="w-4 h-4 border-2 border-slate-300 border-t-purple-600 rounded-full animate-spin shrink-0"></div>
                  ) : search ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        setSuggestions([]);
                        setShowSuggestions(false);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 shrink-0 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : null}
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50">
                  <div className="p-2">
                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pb-2 pt-1 border-b border-slate-100 mb-1">
                      Matching Products
                    </h4>
                    {suggestions.map((item) => (
                      <Link
                        key={item._id}
                        to={`/product/${item._id}`}
                        onClick={() => setShowSuggestions(false)}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                          {item.images?.[0] ? (
                            <img src={item.images[0].url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-4 h-4 m-3 text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-[13px] font-bold text-slate-900 truncate">{item.title}</p>
                          <p className="text-[11px] font-semibold text-purple-600">
                            ₹{item.price.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full mt-1 p-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors flex items-center justify-center gap-1 cursor-pointer"
                    >
                      View all results <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Right Action Bar: Account + More + Cart */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            
            {/* ── 1. ACCOUNT DROPDOWN (Image 2) ── */}
            {!isAuthPage && (
              <div 
                className="relative" 
                ref={accountRef}
                onMouseEnter={() => setOpenAccount(true)}
                onMouseLeave={() => setOpenAccount(false)}
              >
                <button
                  type="button"
                  onClick={() => setOpenAccount(!openAccount)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    openAccount 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-slate-800 hover:text-purple-600 hover:bg-slate-50"
                  }`}
                >
                  <User className="w-4 h-4 text-slate-700" />
                  <span className="hidden sm:inline">
                    {isAuthenticated ? (user?.name?.split(" ")[0] || "Account") : "Account"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openAccount ? "rotate-180 text-purple-600" : "text-slate-500"}`} />
                </button>

                {/* Dropdown Menu (Exact Structure from Image 2) */}
                {openAccount && (
                  <div className="absolute right-0 mt-1 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2.5 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Your Account</span>
                      {!isAuthenticated && (
                        <Link 
                          to="/register" 
                          onClick={() => setOpenAccount(false)}
                          className="text-[11px] font-bold text-purple-600 hover:underline"
                        >
                          Sign Up
                        </Link>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setOpenAccount(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition"
                      >
                        <User className="w-4 h-4 text-slate-500" />
                        <span>My Profile</span>
                      </Link>

                      <Link
                        to={isAuthenticated ? "/orders" : "/login"}
                        onClick={() => setOpenAccount(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition"
                      >
                        <Package className="w-4 h-4 text-slate-500" />
                        <span>Orders</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleFeatureNotice("Coupons", "Exclusive Bazario Coupons: Use code WELCOME10 for 10% OFF at checkout!")}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                      >
                        <Ticket className="w-4 h-4 text-slate-500" />
                        <span>Coupons</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFeatureNotice("Supercoin", "SuperCoins Balance: You earn 2 SuperCoins per ₹100 spent on Bazario!")}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                      >
                        <Coins className="w-4 h-4 text-slate-500" />
                        <span>Supercoin</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFeatureNotice("Plus Zone", "Bazario Plus Zone: Enjoy Free Express Delivery & Early Access to Flash Sales!")}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="font-semibold text-purple-900">Bazario Plus Zone</span>
                      </button>

                      <Link
                        to="/profile"
                        onClick={() => setOpenAccount(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition"
                      >
                        <CreditCard className="w-4 h-4 text-slate-500" />
                        <span>Saved Cards & Wallet</span>
                      </Link>

                      <Link
                        to="/profile"
                        onClick={() => setOpenAccount(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition"
                      >
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span>Saved Addresses</span>
                      </Link>

                      <Link
                        to="/wishlist"
                        onClick={() => setOpenAccount(false)}
                        className="flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition"
                      >
                        <Heart className="w-4 h-4 text-slate-500" />
                        <div className="flex-1 flex items-center justify-between">
                          <span>Wishlist</span>
                          {wishlistCount > 0 && (
                            <span className="bg-rose-100 text-rose-600 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                              {wishlistCount}
                            </span>
                          )}
                        </div>
                      </Link>

                      <button
                        type="button"
                        onClick={() => handleFeatureNotice("Gift Cards", "Bazario Gift Cards: Purchase or redeem digital vouchers instantly!")}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                      >
                        <Gift className="w-4 h-4 text-slate-500" />
                        <span>Gift Cards</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleFeatureNotice("Notifications", "You're all caught up! No unread promotional or order alerts.")}
                        className="w-full text-left flex items-center gap-3 px-4 py-2 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                      >
                        <Bell className="w-4 h-4 text-slate-500" />
                        <span>Notifications</span>
                      </button>
                    </div>

                    {/* Auth Status CTA */}
                    <div className="pt-1 mt-1 border-t border-slate-100">
                      {isAuthenticated ? (
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      ) : (
                        <Link
                          to="/login"
                          onClick={() => setOpenAccount(false)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold bg-purple-600 text-white rounded-xl mx-auto my-1 transition hover:bg-purple-700"
                        >
                          Sign In
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 2. MORE DROPDOWN (Image 3) ── */}
            {!isAuthPage && (
              <div 
                className="relative" 
                ref={moreRef}
                onMouseEnter={() => setOpenMore(true)}
                onMouseLeave={() => setOpenMore(false)}
              >
                <button
                  type="button"
                  onClick={() => setOpenMore(!openMore)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                    openMore 
                      ? "bg-slate-100 text-slate-900" 
                      : "text-slate-800 hover:text-purple-600 hover:bg-slate-50"
                  }`}
                >
                  <span>More</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${openMore ? "rotate-180 text-purple-600" : "text-slate-500"}`} />
                </button>

                {/* Dropdown Menu (Exact items from Image 3) */}
                {openMore && (
                  <div className="absolute right-0 mt-1 w-60 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 pb-2 mb-1 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900">More</span>
                    </div>

                    <div className="space-y-0.5">
                      {/* Become a Seller */}
                      <Link
                        to={isAuthenticated ? (user?.role === "seller" ? "/seller/dashboard" : "/seller/onboarding") : "/login"}
                        onClick={() => setOpenMore(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition"
                      >
                        <Store className="w-4 h-4 text-slate-500" />
                        <span>Become a Seller</span>
                      </Link>

                      {/* Notification Settings */}
                      <button
                        type="button"
                        onClick={() => handleFeatureNotice("Notification Settings", "Notification Preferences: SMS & Email updates are currently ACTIVE.")}
                        className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition cursor-pointer"
                      >
                        <Bell className="w-4 h-4 text-slate-500" />
                        <span>Notification Settings</span>
                      </button>

                      {/* 24x7 Customer Care */}
                      <Link
                        to="/contact"
                        onClick={() => setOpenMore(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition"
                      >
                        <Headphones className="w-4 h-4 text-slate-500" />
                        <span>24x7 Customer Care</span>
                      </Link>

                      {/* Advertise on Bazario (Flipkart) */}
                      <Link
                        to="/contact?subject=Advertise"
                        onClick={() => setOpenMore(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-xs font-medium text-slate-700 hover:text-purple-700 hover:bg-purple-50 transition"
                      >
                        <Presentation className="w-4 h-4 text-slate-500" />
                        <span>Advertise on Bazario</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── 3. CART BUTTON (Image 2) ── */}
            {!isAuthPage && (
              <Link
                to="/cart"
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-slate-800 hover:text-purple-600 hover:bg-slate-50 transition font-bold text-xs sm:text-sm relative group"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 transition group-hover:scale-105" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
              </Link>
            )}

            {/* Direct Login CTA on Login/Register pages */}
            {isAuthPage && (
              <Link
                to={location.pathname === "/login" ? "/register" : "/login"}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold transition shadow-xs hover:bg-purple-700"
              >
                {location.pathname === "/login" ? "Create Account" : "Sign In"}
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar (Mobile Only) */}
        {!isAuthPage && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex items-center bg-slate-50 hover:bg-slate-100 focus-within:bg-white rounded-xl border border-slate-200 overflow-hidden px-3 shadow-2xs">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Products, Brands..."
                  className="w-full py-2.5 px-3 text-xs bg-transparent text-slate-900 !outline-none !ring-0 !border-none !shadow-none"
                  style={{ boxShadow: "none" }}
                />
              </div>
            </form>
          </div>
        )}
      </div>

      {/* ── Flipkart Horizontal Category Sub-Nav Strip (Image 2 & Image 4) ──── */}
      {!isAuthPage && (
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ul className="flex items-center justify-start lg:justify-center gap-6 sm:gap-10 py-2.5 text-xs font-semibold overflow-x-auto whitespace-nowrap scrollbar-hide">
              {navCategories.map((cat, idx) => {
                const Icon = cat.icon;
                const isActive = cat.categoryName 
                  ? activeCategoryParam?.toLowerCase() === cat.categoryName.toLowerCase()
                  : location.pathname === "/shop" && !activeCategoryParam;

                return (
                  <li key={idx} className="shrink-0">
                    <Link
                      to={cat.path}
                      className={`flex flex-col items-center gap-1 px-2.5 py-1 rounded-lg transition-all group ${
                        isActive
                          ? "text-blue-600 font-bold border-b-2 border-blue-600 pb-0.5"
                          : "text-slate-600 hover:text-blue-600"
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? "text-blue-600" : "text-slate-500 group-hover:text-blue-600"}`} />
                      <span className="text-[12px]">{cat.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}

      {/* ── Mobile Navigation Drawer ──────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 animate-in slide-in-from-top duration-200">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Browse Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {navCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg bg-slate-50 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition flex items-center gap-2"
                >
                  <cat.icon className="w-3.5 h-3.5 text-purple-600" />
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/orders"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Package className="w-4 h-4 text-slate-400" />
              My Orders
            </Link>
            <Link
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Heart className="w-4 h-4 text-slate-400" />
              Wishlist ({wishlistCount})
            </Link>
            <Link
              to="/seller/onboarding"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-purple-700 bg-purple-50"
            >
              <Store className="w-4 h-4 text-purple-600" />
              Become a Seller
            </Link>
          </div>

          {!isAuthenticated && (
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="w-full py-2.5 bg-purple-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2"
              >
                Sign In / Register
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
