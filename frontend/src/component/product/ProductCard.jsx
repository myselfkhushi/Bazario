import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Star, ShoppingBag, Check, Minus, Plus, ArrowRight } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addToWishlist, removeFromWishlist } from "../../features/wishlist/wishlistAPI";
import { addWishListItem, removeWishlistItem } from "../../features/wishlist/wishlistSlice";
import { addGuestItem, removeGuestItem, updateGuestQuantity } from "../../features/cart/guestCartSlice";
import { addGuestWishlistItem, removeGuestWishlistItem } from "../../features/wishlist/guestWishlistSlice";
import { addtoCart, getMyCart, updateCart, removeCartItem } from "../../features/cart/cartAPI";
import { setCart } from "../../features/cart/cartSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { items: guestWishlist } = useSelector((state) => state.guestWishlist);
  const { cart } = useSelector((state) => state.cart);
  const { items: guestCart } = useSelector((state) => state.guestCart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const [isAdding, setIsAdding] = useState(false);
  const [isUpdatingQty, setIsUpdatingQty] = useState(false);

  // Check wishlist state
  const isAuthLiked = wishlist?.some((item) => (item.product?._id || item.product) === product._id);
  const isGuestLiked = guestWishlist?.some((item) => (item.product?._id || item._id) === product._id);
  const isLiked = isAuthenticated ? isAuthLiked : isGuestLiked;

  // Check cart state
  const cartItem = isAuthenticated
    ? cart?.find((item) => (item.product?._id || item.product) === product._id)
    : guestCart?.find((item) => (item.product?._id || item._id) === product._id);
  const quantityInCart = cartItem?.quantity || 0;

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      if (!isLiked) {
        dispatch(addGuestWishlistItem(product));
        toast.success("Added to wishlist!");
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
        toast.success("Added to wishlist!");
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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0 || isAdding) return;

    setIsAdding(true);
    try {
      if (isAuthenticated) {
        await addtoCart(product._id);
        const res = await getMyCart();
        dispatch(setCart(res.cart));
      } else {
        dispatch(addGuestItem(product));
      }
      toast.success("Added to cart!");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncreaseQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (quantityInCart >= product.stock) {
      toast.error(`Only ${product.stock} units available in stock`);
      return;
    }

    setIsUpdatingQty(true);
    try {
      if (isAuthenticated) {
        await updateCart(cartItem._id, quantityInCart + 1);
        const res = await getMyCart();
        dispatch(setCart(res.cart));
      } else {
        dispatch(updateGuestQuantity({ productId: product._id, quantity: quantityInCart + 1 }));
      }
    } catch (err) {
      toast.error("Could not update quantity");
    } finally {
      setIsUpdatingQty(false);
    }
  };

  const handleDecreaseQuantity = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsUpdatingQty(true);
    try {
      if (quantityInCart <= 1) {
        // Remove item from cart
        if (isAuthenticated) {
          await removeCartItem(cartItem._id);
          const res = await getMyCart();
          dispatch(setCart(res.cart));
        } else {
          dispatch(removeGuestItem(product._id));
        }
        toast("Removed from cart", { icon: "🗑️" });
      } else {
        // Decrement quantity
        if (isAuthenticated) {
          await updateCart(cartItem._id, quantityInCart - 1);
          const res = await getMyCart();
          dispatch(setCart(res.cart));
        } else {
          dispatch(updateGuestQuantity({ productId: product._id, quantity: quantityInCart - 1 }));
        }
      }
    } catch (err) {
      toast.error("Could not update quantity");
    } finally {
      setIsUpdatingQty(false);
    }
  };

  const originalPrice = product.mrp || Math.round(product.price * 1.25);
  const discount = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden">
      {/* Product Image Box */}
      <Link to={`/product/${product._id}`} className="relative aspect-square w-full bg-slate-50 overflow-hidden block">
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/400"}
          alt={product.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold tracking-tight border border-emerald-200">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white shadow-sm flex items-center justify-center transition-transform duration-150 hover:scale-110 active:scale-95"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isLiked ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-slate-600"
            }`}
          />
        </button>
      </Link>

      {/* Product Info */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
        <div>
          {/* Category & Rating Row */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider truncate">
              {product.brand || product.category || "General"}
            </span>

            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-xs font-bold text-slate-700">
                {product.rating ? product.rating.toFixed(1) : "4.5"}
              </span>
              <span className="text-[10px] text-slate-400">
                ({product.numReviews || 12})
              </span>
            </div>
          </div>

          {/* Title */}
          <Link to={`/product/${product._id}`} className="block">
            <h3 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-1 hover:text-purple-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-sm sm:text-base font-bold text-slate-900">
              ₹{product.price?.toLocaleString("en-IN")}
            </span>
            {originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
        </div>

        {/* Interactive Cart Controls */}
        {product.stock <= 0 ? (
          <button
            disabled
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-slate-100 text-slate-400 cursor-not-allowed text-center"
          >
            Out of Stock
          </button>
        ) : quantityInCart > 0 ? (
          /* Professional Stepper & Go To Cart when in Cart */
          <div className="flex items-center gap-2">
            {/* Quantity Stepper */}
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50 shrink-0">
              <button
                type="button"
                onClick={handleDecreaseQuantity}
                disabled={isUpdatingQty}
                className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition active:scale-95 disabled:opacity-40"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-7 text-center text-xs font-bold text-slate-900">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={handleIncreaseQuantity}
                disabled={isUpdatingQty || quantityInCart >= product.stock}
                className="w-7 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition active:scale-95 disabled:opacity-40"
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Go to Cart Button */}
            <Link
              to="/cart"
              className="flex-1 py-2 px-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1 shadow-sm transition active:scale-[0.98]"
            >
              Go to Cart
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          /* Default Add to Cart Button */
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-150 bg-slate-900 hover:bg-purple-600 text-white shadow-sm active:scale-[0.98]"
          >
            {isAdding ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                Add to Cart
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}