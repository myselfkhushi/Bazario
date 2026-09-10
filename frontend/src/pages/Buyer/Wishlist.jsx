import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2, ShoppingCart, Eye, Sparkles } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
    getMyWishlist,
    removeFromWishlist,
} from "../../features/wishlist/wishlistAPI";

import {
    setWishlist,
    setWishlistError,
    setWishlistLoading,
} from "../../features/wishlist/wishlistSlice";

import { removeGuestWishlistItem } from "../../features/wishlist/guestWishlistSlice";
import { addtoCart, getMyCart } from "../../features/cart/cartAPI";
import { setCart } from "../../features/cart/cartSlice";
import { addGuestItem } from "../../features/cart/guestCartSlice";

function Wishlist() {
    const dispatch = useDispatch();

    const { wishlist, loading } = useSelector((state) => state.wishlist);
    const { items: guestWishlist } = useSelector((state) => state.guestWishlist);
    const { isAuthenticated } = useSelector((state) => state.auth);

    // Active items to display
    const items = isAuthenticated ? wishlist : guestWishlist;

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        }
    }, [isAuthenticated]);

    const fetchWishlist = async () => {
        try {
            dispatch(setWishlistLoading());
            const response = await getMyWishlist();
            dispatch(setWishlist(response.wishlist));
        } catch (error) {
            dispatch(
                setWishlistError(
                    error.response?.data?.message || "Something went wrong"
                )
            );
        }
    };

    const handleRemove = async (item) => {
        if (!isAuthenticated) {
            const prodId = item.product?._id || item._id;
            dispatch(removeGuestWishlistItem(prodId));
            toast("Removed from wishlist", { icon: "💔" });
            return;
        }

        try {
            await removeFromWishlist(item._id);
            const response = await getMyWishlist();
            dispatch(setWishlist(response.wishlist));
            toast("Removed from wishlist", { icon: "💔" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item");
        }
    };

    const handleAddToCart = async (product) => {
        try {
            if (isAuthenticated) {
                await addtoCart(product._id);
                const response = await getMyCart();
                dispatch(setCart(response.cart));
            } else {
                dispatch(addGuestItem(product));
            }
            toast.success("Moved to cart!");
        } catch (error) {
            toast.error("Failed to add to cart");
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1">
                        Saved Collections
                    </p>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                        My Wishlist
                    </h1>
                </div>
                <span className="badge badge-primary text-xs py-1.5 px-3 self-start sm:self-auto">
                    {items.length} {items.length === 1 ? "Item" : "Items"} Saved
                </span>
            </div>

            {/* Guest notice banner */}
            {!isAuthenticated && items.length > 0 && (
                <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-purple-50/80 border border-purple-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-gray-900">
                                Guest Wishlist Active
                            </p>
                            <p className="text-xs text-gray-500">
                                These items are saved in this browser. Sign in to permanently save them to your account.
                            </p>
                        </div>
                    </div>
                    <Link
                        to="/login"
                        className="btn-primary text-xs py-2 px-5 shrink-0"
                    >
                        Sign In Now
                    </Link>
                </div>
            )}

            {/* Empty State */}
            {items.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-sm border border-purple-100/60 py-20 px-6 flex flex-col items-center text-center max-w-xl mx-auto">
                    <div className="w-20 h-20 rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-6 shadow-inner">
                        <Heart className="w-10 h-10 fill-red-100 stroke-red-500" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                        Your Wishlist is Empty
                    </h2>

                    <p className="text-gray-500 mt-2 text-sm max-w-sm">
                        Explore our featured collection and tap the heart icon to save products for later.
                    </p>

                    <Link to="/" className="mt-8 btn-primary">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                /* Grid of items */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((item) => {
                        const prod = item.product || item;
                        const imgUrl = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600";

                        return (
                            <div
                                key={item._id || prod._id}
                                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-100/60 flex flex-col"
                            >
                                {/* Image */}
                                <div className="relative aspect-square overflow-hidden bg-gray-50">
                                    <Link to={`/product/${prod._id}`}>
                                        <img
                                            src={imgUrl}
                                            alt={prod.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </Link>
                                    <button
                                        onClick={() => handleRemove(item)}
                                        className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-md flex items-center justify-center text-gray-400 hover:text-red-500 hover:scale-110 transition-all"
                                        title="Remove from wishlist"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex flex-col flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="badge badge-primary text-[10px]">
                                            {prod.category}
                                        </span>
                                        <span className="text-xs font-semibold text-emerald-600">
                                            In Stock
                                        </span>
                                    </div>

                                    <Link to={`/product/${prod._id}`}>
                                        <h3 className="text-base font-bold text-gray-900 line-clamp-1 hover:text-purple-600 transition-colors" style={{ fontFamily: "var(--font-heading)" }}>
                                            {prod.title}
                                        </h3>
                                    </Link>

                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed flex-1">
                                        {prod.description}
                                    </p>

                                    <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-2xl font-black text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                                            ₹{prod.price?.toLocaleString("en-IN")}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-4">
                                        <Link
                                            to={`/product/${prod._id}`}
                                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                                        >
                                            <Eye className="w-3.5 h-3.5" /> View
                                        </Link>
                                        <button
                                            onClick={() => handleAddToCart(prod)}
                                            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold text-white transition-all shadow-md hover:shadow-lg"
                                            style={{ background: "linear-gradient(135deg,#6C3EF4,#A855F7)" }}
                                        >
                                            <ShoppingCart className="w-3.5 h-3.5" /> Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Wishlist;