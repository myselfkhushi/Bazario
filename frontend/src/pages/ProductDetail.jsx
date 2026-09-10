import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { 
  Star, 
  ShoppingBag, 
  Zap, 
  Heart, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  CreditCard, 
  ChevronRight, 
  Minus, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Share2,
  Tag,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  ThumbsUp,
  AlertCircle
} from "lucide-react";

import { getSingleProduct, getAllProducts } from "../features/product/productAPI";
import { setProducts } from "../features/product/productSlice";
import { createReview, getProductReviews, updateReview, deleteReview } from "../features/review/reviewAPI";
import { setReviewsLoading, setReviewsError, setReviews } from "../features/review/reviewSlice";
import { addtoCart, getMyCart } from "../features/cart/cartAPI";
import { setCart } from "../features/cart/cartSlice";
import DetailsSkeleton from "../component/product/DetailsSkeleton.jsx";
import { addGuestItem } from "../features/cart/guestCartSlice";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistAPI";
import { addWishListItem, removeWishlistItem } from "../features/wishlist/wishlistSlice";
import { addGuestWishlistItem, removeGuestWishlistItem } from "../features/wishlist/guestWishlistSlice";
import ProductCard from "../component/product/ProductCard.jsx";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { reviews } = useSelector((state) => state.review);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { items: guestWishlist } = useSelector((state) => state.guestWishlist);
  const { product: allProducts } = useSelector((state) => state.product);

  const [product, setProduct] = useState(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [justAddedToCart, setJustAddedToCart] = useState(false);

  // Delivery Pincode Checker
  const [pincode, setPincode] = useState("");
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [deliveryDateStr, setDeliveryDateStr] = useState("");

  // Review Form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  // Wishlist check
  const isAuthLiked = wishlist?.some((item) => (item.product?._id || item.product) === product?._id);
  const isGuestLiked = guestWishlist?.some((item) => (item.product?._id || item._id) === product?._id);
  const isLiked = isAuthenticated ? isAuthLiked : isGuestLiked;

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
    if (!allProducts || allProducts.length === 0) {
      fetchAllProducts();
    }
    // Reset state on ID change
    setSelectedImageIndex(0);
    setQuantity(1);
    setShowReviewForm(false);
    setPincodeChecked(false);
    // eslint-disable-next-line
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setPageLoading(true);
      const res = await getSingleProduct(id);
      setProduct(res.product);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load product");
    } finally {
      setPageLoading(false);
    }
  };

  const fetchProductReviews = async () => {
    try {
      dispatch(setReviewsLoading());
      const res = await getProductReviews(id);
      dispatch(setReviews(res.reviews || []));
    } catch (err) {
      dispatch(setReviewsError(err?.response?.data?.message || "Failed to load reviews"));
    }
  };

  const fetchAllProducts = async () => {
    try {
      const res = await getAllProducts();
      dispatch(setProducts(res.product || []));
    } catch (err) {
      console.error(err);
    }
  };

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.trim().length < 6) {
      toast.error("Please enter a valid 6-digit postal PIN code");
      return;
    }

    // Calculate delivery date 3 days from now
    const d = new Date();
    d.setDate(d.getDate() + 3);
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    setDeliveryDateStr(d.toLocaleDateString('en-US', options));
    setPincodeChecked(true);
    toast.success(`Serviceable! Delivery available to PIN ${pincode.trim()}`);
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

    if (!isAuthenticated) {
      if (!isLiked) {
        dispatch(addGuestWishlistItem(product));
        toast.success("Saved to wishlist!");
      } else {
        dispatch(removeGuestWishlistItem(product._id));
        toast("Removed from wishlist", { icon: "💔" });
      }
      return;
    }

    try {
      if (!isLiked) {
        const res = await addToWishlist(product._id);
        dispatch(addWishListItem(res.wishlist));
        toast.success("Saved to wishlist!");
      } else {
        const item = wishlist.find((w) => (w.product?._id || w.product) === product._id);
        if (item) {
          await removeFromWishlist(item._id);
          dispatch(removeWishlistItem(item._id));
          toast("Removed from wishlist", { icon: "💔" });
        }
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Wishlist error");
    }
  };

  const handleAddToCart = async (goToCheckout = false) => {
    if (!product || product.stock <= 0) return;

    setIsAddingToCart(true);
    try {
      if (isAuthenticated) {
        for (let i = 0; i < quantity; i++) {
          await addtoCart(product._id);
        }
        const res = await getMyCart();
        dispatch(setCart(res.cart));
      } else {
        for (let i = 0; i < quantity; i++) {
          dispatch(addGuestItem(product));
        }
      }

      setJustAddedToCart(true);
      toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to cart!`);
      setTimeout(() => setJustAddedToCart(false), 2000);

      if (goToCheckout) {
        navigate(isAuthenticated ? "/checkout" : "/login");
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleReviewSubmit = async (formData) => {
    try {
      const payload = {
        rating: selectedRating,
        comment: formData.comment
      };

      if (editingReviewId) {
        await updateReview(editingReviewId, payload);
        toast.success("Review updated successfully!");
        setEditingReviewId(null);
      } else {
        await createReview(id, payload);
        toast.success("Review submitted! Thank you for your feedback.");
      }

      reset({ comment: "" });
      setSelectedRating(5);
      setShowReviewForm(false);
      fetchProductReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not submit review");
    }
  };

  const startEditReview = (rev) => {
    setEditingReviewId(rev._id);
    setSelectedRating(rev.rating);
    setValue("comment", rev.comment);
    setShowReviewForm(true);
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete your review?")) return;
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted");
      fetchProductReviews();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not delete review");
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.title,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (pageLoading || !product) {
    return <DetailsSkeleton />;
  }

  const originalPrice = product.mrp || Math.round(product.price * 1.25);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: "https://via.placeholder.com/600" }];
  const currentImage = images[selectedImageIndex]?.url || images[0]?.url;

  // Filter similar products
  const similarProducts = (allProducts || [])
    .filter((p) => p._id !== product._id && (p.category === product.category || !product.category))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* ── Breadcrumb Bar ────────────────────────────── */}
      <div className="border-b border-slate-200 bg-white shadow-sm mb-6 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto whitespace-nowrap">
            <Link to="/" className="hover:text-purple-600 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <Link to={`/?category=${product.category}`} className="hover:text-slate-900 transition">
              {product.category || "Catalog"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="text-slate-800 font-medium truncate max-w-xs">{product.title}</span>
          </nav>
        </div>
      </div>

      {/* ── Main Product Stage ────────────────────────── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">

          {/* LEFT: Product Gallery (5 cols on lg) */}
          <div className="lg:col-span-6 lg:sticky lg:top-24">
            <div className="flex flex-col-reverse sm:flex-row gap-4">
              
              {/* Vertical Thumbnails */}
              {images.length > 1 && (
                <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-visible shrink-0 pb-2 sm:pb-0">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 sm:w-18 sm:h-18 rounded-lg border overflow-hidden bg-slate-50 shrink-0 transition ${
                        selectedImageIndex === idx
                          ? "border-slate-900 ring-1 ring-slate-900"
                          : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Viewport */}
              <div className="relative flex-1 aspect-square bg-white border border-slate-100 shadow-sm rounded-2xl overflow-hidden flex items-center justify-center group">
                <img
                  src={currentImage}
                  alt={product.title}
                  className="w-full h-full object-contain p-6 transition-transform duration-300 group-hover:scale-105"
                />

                {/* Floating Top Actions */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    title="Share product"
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-500 hover:text-slate-900 transition"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleWishlistToggle}
                    title={isLiked ? "Remove from wishlist" : "Add to wishlist"}
                    className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center transition"
                  >
                    <Heart
                      className={`w-4 h-4 transition-colors ${
                        isLiked ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-500"
                      }`}
                    />
                  </button>
                </div>

                {/* Top Left Discount Tag */}
                {discount > 0 && (
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[11px] font-bold tracking-tight shadow-sm">
                      {discount}% OFF
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Guarantees Strip */}
            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <Truck className="w-5 h-5 text-slate-700 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">Free Delivery</span>
                <span className="text-[10px] text-slate-400">On orders ₹499+</span>
              </div>
              <div className="flex flex-col items-center">
                <RotateCcw className="w-5 h-5 text-slate-700 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">7 Days Return</span>
                <span className="text-[10px] text-slate-400">Zero hassle refund</span>
              </div>
              <div className="flex flex-col items-center">
                <ShieldCheck className="w-5 h-5 text-slate-700 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">100% Authentic</span>
                <span className="text-[10px] text-slate-400">Direct from source</span>
              </div>
              <div className="flex flex-col items-center">
                <CreditCard className="w-5 h-5 text-slate-700 mb-1" />
                <span className="text-[11px] font-semibold text-slate-800">Secure Payment</span>
                <span className="text-[10px] text-slate-400">UPI / Cards / COD</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Buy Box (6 cols on lg) */}
          <div className="lg:col-span-6 flex flex-col">
            {/* Header: Brand & Title */}
            <div className="mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-purple-600 block mb-1.5">
                {product.category || "Bazario Essentials"}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
                {product.title}
              </h1>
            </div>

            {/* Ratings & Status Row */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs font-bold text-amber-900">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating ? product.rating.toFixed(1) : "4.8"}</span>
              </div>
              <a href="#customer-reviews" className="text-xs text-slate-500 hover:text-purple-600 transition underline underline-offset-2">
                {reviews.length || product.numReviews || 0} customer reviews
              </a>
              <span className="text-slate-300">•</span>
              <span className={`text-xs font-semibold ${product.stock > 0 ? "text-emerald-700" : "text-rose-600"}`}>
                {product.stock > 0 ? `In Stock (${product.stock} available)` : "Currently Out of Stock"}
              </span>
            </div>

            {/* Price Box */}
            <div className="mb-6 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-end gap-3 mb-1">
                <span className="text-3xl font-black text-slate-900">
                  ₹{product.price?.toLocaleString("en-IN")}
                </span>
                {originalPrice > product.price && (
                  <>
                    <span className="text-sm font-medium text-slate-400 line-through pb-1">
                      ₹{originalPrice.toLocaleString("en-IN")}
                    </span>
                    <span className="text-xs font-bold text-purple-700 bg-purple-100/60 px-2.5 py-1 rounded-lg pb-1.5">
                      Save ₹{(originalPrice - product.price).toLocaleString("en-IN")} ({discount}%)
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs font-medium text-slate-500 mt-2">
                Inclusive of all taxes. No Cost EMI starts from <strong className="text-slate-700">₹{Math.round(product.price / 6)}/month</strong>
              </p>
            </div>

            {/* Bank & Coupon Offers */}
            <div className="mb-6">
              <div className="flex flex-col gap-2 border-t border-b border-slate-200 py-4">
                <div className="text-xs flex items-start gap-2 text-slate-600">
                  <Tag className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Bank Offer:</strong> Flat 5% Cashback on Axis & HDFC Bank Cards.
                  </div>
                </div>
                <div className="text-xs flex items-start gap-2 text-slate-600">
                  <Tag className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900">Promo:</strong> Get ₹150 off on first purchase using code <span className="font-mono font-bold text-slate-900">WELCOME150</span>.
                  </div>
                </div>
              </div>
            </div>

            {/* Pincode / Delivery Estimator */}
            <div className="mb-8">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                Delivery Options
              </span>
              <form onSubmit={handlePincodeCheck} className="flex gap-2 max-w-sm">
                <div className="relative flex-1">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="Enter 6-digit Pincode"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ""));
                      setPincodeChecked(false);
                    }}
                    className="w-full pl-9 pr-3 py-2 rounded-none border border-slate-200 text-xs font-medium focus:outline-none focus:border-slate-900 focus:ring-0 transition-colors bg-slate-50"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2 bg-slate-900 hover:bg-slate-700 text-white text-xs font-bold transition-colors"
                >
                  Check
                </button>
              </form>

              {pincodeChecked && (
                <div className="mt-2.5 text-xs text-emerald-700 flex items-center gap-1.5 font-medium animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Get it by <strong className="text-slate-900">{deliveryDateStr}</strong> | Standard Delivery: Free</span>
                </div>
              )}
            </div>

            {/* Key Highlights (if available from seller) */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-8 pt-6 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2.5">
                  Key Highlights
                </span>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {product.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1 h-1 bg-slate-900 rounded-full shrink-0 mt-2"></span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description Preview */}
            <div className="mb-6">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-1.5">
                Description
              </span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Quantity Stepper & Buy Buttons */}
            <div className="space-y-4 pt-6 border-t border-slate-200">
              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Quantity:</span>
                  <div className="flex items-center border border-slate-200 bg-slate-50">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-slate-900">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition disabled:opacity-30"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => handleAddToCart(false)}
                  disabled={product.stock <= 0 || isAddingToCart}
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
                    product.stock <= 0
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : justAddedToCart
                      ? "bg-purple-600 text-white shadow-md shadow-purple-200"
                      : "bg-white border border-slate-200 text-slate-700 hover:border-purple-300 hover:bg-purple-50 hover:text-purple-700 hover:shadow-md"
                  }`}
                >
                  {product.stock <= 0 ? (
                    "Out of Stock"
                  ) : justAddedToCart ? (
                    <>
                      <Check className="w-4 h-4" />
                      Added to Cart
                    </>
                  ) : isAddingToCart ? (
                    <div className="w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Add to Cart
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleAddToCart(true)}
                  disabled={product.stock <= 0 || isAddingToCart}
                  className="flex-1 py-4 px-6 rounded-xl font-bold text-sm bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2 transition-all duration-300 shadow-md shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                >
                  <Zap className="w-4 h-4" />
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── Technical Specifications Section ────────── */}
        <section className="mt-16 pt-12 border-t border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Product Specifications</h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
              <div className="divide-y divide-slate-100">
                <div className="flex p-3 bg-slate-50/50">
                  <span className="w-1/3 text-slate-500 font-medium">Model / Item ID</span>
                  <span className="w-2/3 text-slate-900 font-mono font-semibold">{product._id}</span>
                </div>
                <div className="flex p-3">
                  <span className="w-1/3 text-slate-500 font-medium">Brand</span>
                  <span className="w-2/3 text-slate-900 font-semibold">{product.brand || "Bazario Official"}</span>
                </div>
                <div className="flex p-3 bg-slate-50/50">
                  <span className="w-1/3 text-slate-500 font-medium">Category</span>
                  <span className="w-2/3 text-slate-900 font-semibold">{product.category}</span>
                </div>
                {product.color && (
                  <div className="flex p-3">
                    <span className="w-1/3 text-slate-500 font-medium">Color</span>
                    <span className="w-2/3 text-slate-900 font-semibold">{product.color}</span>
                  </div>
                )}
              </div>

              <div className="divide-y divide-slate-100">
                <div className="flex p-3 bg-slate-50/50">
                  <span className="w-1/3 text-slate-500 font-medium">Warranty</span>
                  <span className="w-2/3 text-slate-900 font-semibold">{product.warranty || "1 Year Brand Warranty"}</span>
                </div>
                <div className="flex p-3">
                  <span className="w-1/3 text-slate-500 font-medium">Return Policy</span>
                  <span className="w-2/3 text-slate-900 font-semibold">{product.returnPolicy || "7 Days Doorstep Replacement"}</span>
                </div>
                <div className="flex p-3 bg-slate-50/50">
                  <span className="w-1/3 text-slate-500 font-medium">Stock Availability</span>
                  <span className="w-2/3 text-slate-900 font-semibold">{product.stock} units in warehouse</span>
                </div>
                {(product.size || product.weight) && (
                  <div className="flex p-3">
                    <span className="w-1/3 text-slate-500 font-medium">{product.size ? "Size" : "Weight"}</span>
                    <span className="w-2/3 text-slate-900 font-semibold">{product.size || product.weight}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── Customer Reviews & Ratings Section ──────── */}
        <section id="customer-reviews" className="mt-16 pt-12 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Customer Ratings & Reviews</h2>
              <p className="text-xs text-slate-500 mt-1">Real experiences shared by verified Bazario shoppers</p>
            </div>

            <button
              type="button"
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="py-2.5 px-4 rounded-xl border border-slate-900 hover:bg-slate-900 hover:text-white text-xs font-semibold text-slate-900 transition self-start sm:self-auto"
            >
              {showReviewForm ? "Close Review Form" : "Write a Review"}
            </button>
          </div>

          {/* Write / Edit Review Form */}
          {showReviewForm && (
            <div className="mb-10 p-6 rounded-2xl bg-slate-50 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-900 mb-3">
                {editingReviewId ? "Edit Your Review" : "Share Your Experience"}
              </h3>
              <form onSubmit={handleSubmit(handleReviewSubmit)} className="space-y-4">
                <div>
                  <span className="block text-xs font-semibold text-slate-700 mb-1.5">Rating</span>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setSelectedRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-0.5 text-slate-300 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            (hoverRating || selectedRating) >= star
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-slate-700 ml-2">
                      {selectedRating} out of 5 stars
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Review
                  </label>
                  <textarea
                    rows={3}
                    required
                    placeholder="What did you like or dislike about this product? How was the build quality?"
                    {...register("comment", { required: true })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
                  >
                    {editingReviewId ? "Update Review" : "Submit Review"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowReviewForm(false);
                      setEditingReviewId(null);
                      reset({ comment: "" });
                    }}
                    className="py-2.5 px-4 text-slate-500 hover:text-slate-800 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Rating Summary Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-100 mb-8">
            <div className="md:col-span-4 flex flex-col justify-center items-center p-6 bg-slate-50 rounded-2xl text-center">
              <span className="text-5xl font-black text-slate-900">{product.rating ? product.rating.toFixed(1) : "4.8"}</span>
              <div className="flex items-center gap-1 my-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-xs text-slate-500 font-medium">Based on {reviews.length || product.numReviews || 0} reviews</span>
            </div>

            <div className="md:col-span-8 flex flex-col justify-center space-y-2">
              {[
                { stars: 5, pct: 75 },
                { stars: 4, pct: 15 },
                { stars: 3, pct: 6 },
                { stars: 2, pct: 2 },
                { stars: 1, pct: 2 }
              ].map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-xs">
                  <span className="w-12 text-slate-600 font-medium">{row.stars} star</span>
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full" style={{ width: `${row.pct}%` }} />
                  </div>
                  <span className="w-8 text-right text-slate-400 font-mono">{row.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Individual Reviews List */}
          {reviews.length === 0 ? (
            <div className="text-center py-10">
              <Star className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No reviews yet</p>
              <p className="text-xs text-slate-400 mt-1">Be the first to share your thoughts with other customers!</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {reviews.map((rev) => {
                const isOwner = isAuthenticated && user && (rev.user?._id === user._id || rev.user === user._id);
                const authorName = rev.user?.name || "Verified Customer";
                const initials = authorName.slice(0, 2).toUpperCase();

                return (
                  <div key={rev._id} className="py-5 first:pt-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{authorName}</span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3" />
                              Verified Buyer
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < (rev.rating || 5)
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-200"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {isOwner && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => startEditReview(rev)}
                            className="p-1.5 text-slate-400 hover:text-slate-800 transition"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev._id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-11">
                      {rev.comment}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Similar Products Section ────────────────── */}
        {similarProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Similar Products You Might Like</h2>
                <p className="text-xs text-slate-500 mt-0.5">Explore popular items in {product.category}</p>
              </div>
              <Link to="/" className="text-xs font-semibold text-purple-600 hover:underline">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {similarProducts.map((simProd) => (
                <ProductCard key={simProd._id} product={simProd} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}