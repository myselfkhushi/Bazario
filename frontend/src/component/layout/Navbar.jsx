import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  LogOut,
  Package,
  ClipboardList,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
  Store,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import axios from "axios";

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

  const [openProfile, setOpenProfile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Item counts
  const cartCount = isAuthenticated ? (cart?.length ?? 0) : (guestCart?.length ?? 0);
  const wishlistCount = isAuthenticated ? (wishlist?.length ?? 0) : (guestWishlist?.length ?? 0);

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      toast.success("Signed out successfully");
      navigate("/login");
      setOpenProfile(false);
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
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
  }, [location]);

  // Live Search Suggestions (Debounced)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!search.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      setIsSearching(true);
      try {
        // Fetch products matching search
        const { data } = await axios.get(`http://localhost:5000/api/v1/product/allproduct?search=${search}`);
        if (data.success) {
          // Limit to 5 suggestions
          setSuggestions(data.products.slice(0, 5));
          setShowSuggestions(true);
        }
      } catch (error) {
        console.error("Failed to fetch suggestions", error);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchSuggestions();
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (search.trim()) {
      navigate(`/shop?search=${encodeURIComponent(search.trim())}`);
    } else {
      navigate("/shop");
    }
  };

  const navCategories = [
    { label: "Shop", path: "/shop" },
    { label: "Electronics", path: "/shop?category=Electronics" },
    { label: "Fashion", path: "/shop?category=Fashion" },
    { label: "Footwear", path: "/shop?category=Footwear" },
    { label: "Watches", path: "/shop?category=Watches" },
    { label: "Home & Living", path: "/shop?category=Home" },
    { label: "Beauty", path: "/shop?category=Beauty" },
    { label: "Health", path: "/shop?category=Health" },
    { label: "Sports", path: "/shop?category=Sports" },
    { label: "Books", path: "/shop?category=Books" },
    { label: "Toys", path: "/shop?category=Toys" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* ── Main Header ─────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-4 sm:gap-8">
          
          {/* Logo & Mobile Menu Trigger */}
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link to="/" className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-sans">
                  BAZARIO<span className="text-purple-600">.</span>
                </span>
              </Link>
            </div>

          </div>

          {/* Search Bar (Desktop) with Auto-Suggest */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-auto px-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="flex items-center bg-slate-50 hover:bg-slate-100 focus-within:bg-white rounded-full border border-slate-200 transition-all overflow-hidden h-10 px-4 shadow-sm">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  placeholder="Search products..."
                  className="w-full h-full px-3 text-[13px] bg-transparent text-slate-900 placeholder-slate-400 !outline-none !ring-0 !border-none !shadow-none"
                  style={{ boxShadow: "none" }}
                />
                {isSearching ? (
                  <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin shrink-0"></div>
                ) : search && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setSuggestions([]);
                      setShowSuggestions(false);
                    }}
                    className="p-1 text-slate-400 hover:text-slate-600 shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden z-50">
                <div className="p-2">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-3 pb-2 pt-1 border-b border-slate-50 mb-1">
                    Products
                  </h4>
                  {suggestions.map((item) => (
                    <Link
                      key={item._id}
                      to={`/product/${item._id}`}
                      onClick={() => setShowSuggestions(false)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
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
                        <p className="text-[11px] font-medium text-slate-500">
                          ₹{item.price.toLocaleString("en-IN")}
                        </p>
                      </div>
                    </Link>
                  ))}
                  
                  <button
                    onClick={handleSearchSubmit}
                    className="w-full mt-1 p-2 text-xs font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    View all results <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Sell on Bazario (if buyer or guest) */}
            {(!isAuthenticated || user?.role === "buyer") && (
              <Link
                to={isAuthenticated ? "/seller/dashboard" : "/login"}
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-purple-600 hover:bg-slate-50 border border-slate-200 transition"
              >
                <Store className="w-3.5 h-3.5 text-purple-600" />
                Become a Seller
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="flex items-center gap-1.5 p-2 rounded-xl text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition relative group"
              title="Wishlist"
            >
              <div className="relative">
                <Heart className="w-5 h-5 text-slate-700 group-hover:text-purple-600 transition" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center px-1 border-2 border-white">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="flex items-center gap-1.5 p-2 rounded-xl text-slate-700 hover:text-purple-600 hover:bg-slate-50 transition relative group"
              title="Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-purple-600 transition" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] rounded-full bg-purple-600 text-white text-[10px] font-bold flex items-center justify-center px-1 border-2 border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold">Cart</span>
            </Link>

            <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

            {/* Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold uppercase shrink-0">
                    {user?.name?.[0] || "U"}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-slate-700 max-w-[80px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${openProfile ? "rotate-180" : ""}`} />
                </button>

                {openProfile && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fadeIn z-50">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
                        Signed in as
                      </p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.email}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition"
                        onClick={() => setOpenProfile(false)}
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        My Profile
                      </Link>

                      {user?.role === "buyer" && (
                        <>
                          <Link
                            to="/orders"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition"
                            onClick={() => setOpenProfile(false)}
                          >
                            <Package className="w-4 h-4 text-slate-400" />
                            My Orders
                          </Link>
                          <Link
                            to="/register/seller"
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition"
                            onClick={() => setOpenProfile(false)}
                          >
                            <Store className="w-4 h-4 text-slate-400" />
                            Become a Seller
                          </Link>
                        </>
                      )}

                      {user?.role === "seller" && (
                        <Link
                          to="/seller/dashboard"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition"
                          onClick={() => setOpenProfile(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Seller Dashboard
                        </Link>
                      )}

                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:text-purple-600 hover:bg-purple-50 transition"
                          onClick={() => setOpenProfile(false)}
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          Admin Console
                        </Link>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-purple-600 text-white text-xs font-bold transition shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Search Bar (Mobile Only) */}
        <div className="lg:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="flex items-center bg-slate-50 hover:bg-slate-100 focus-within:bg-white rounded-xl border border-slate-200 overflow-hidden px-3 shadow-sm">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full py-2.5 px-3 text-xs bg-transparent text-slate-900 !outline-none !ring-0 !border-none !shadow-none"
                style={{ boxShadow: "none" }}
              />
            </div>
          </form>
        </div>
      </div>

      {/* ── Secondary Category Sub-Nav Bar (Desktop) ──── */}
      <div className="hidden lg:block border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-8 sm:gap-10 py-3 text-[13px] font-semibold text-slate-500 overflow-x-auto whitespace-nowrap scrollbar-hide">
            {navCategories.map((cat, idx) => (
              <li key={idx}>
                <Link
                  to={cat.path}
                  className="hover:text-purple-600 transition hover:underline underline-offset-4"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Mobile Navigation Drawer ──────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 animate-fadeIn">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Browse Categories
            </span>
            <div className="grid grid-cols-2 gap-2">
              {navCategories.map((cat, idx) => (
                <Link
                  key={idx}
                  to={cat.path}
                  className="px-3 py-2 rounded-lg bg-slate-50 text-xs font-bold text-slate-700 hover:bg-purple-50 hover:text-purple-700 transition"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          {!isAuthenticated && (
            <div className="pt-2 border-t border-slate-100">
              <Link
                to="/login"
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