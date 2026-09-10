import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowRight, ShieldCheck, Trash2, Plus, Minus, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

import { getMyCart, updateCart, removeCartItem } from "../../features/cart/cartAPI";
import { setCart, setLoading, setError } from "../../features/cart/cartSlice";
import { updateGuestQuantity, removeGuestItem } from "../../features/cart/guestCartSlice";

function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { cart, loading } = useSelector((state) => state.cart);
    const { items: guestCart } = useSelector((state) => state.guestCart);
    const { isAuthenticated } = useSelector((state) => state.auth);

    const activeCart = isAuthenticated ? cart : guestCart;

    useEffect(() => {
        if (isAuthenticated) {
            const fetchCart = async () => {
                try {
                    dispatch(setLoading(true));
                    const response = await getMyCart();
                    dispatch(setCart(response.cart));
                } catch (error) {
                    dispatch(setError(error.response?.data?.message || "Something went wrong"));
                } finally {
                    dispatch(setLoading(false));
                }
            };
            fetchCart();
        }
    }, [dispatch, isAuthenticated]);

    const handleQuantity = async (item, newQuantity) => {
        if (newQuantity < 1) return;

        if (!isAuthenticated) {
            const prodId = item.product?._id || item._id;
            dispatch(updateGuestQuantity({ productId: prodId, quantity: newQuantity }));
            toast.success("Cart updated");
            return;
        }

        try {
            await updateCart(item._id, newQuantity);
            const response = await getMyCart();
            dispatch(setCart(response.cart));
            toast.success("Cart updated");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    };

    const handleRemove = async (item) => {
        if (!isAuthenticated) {
            const prodId = item.product?._id || item._id;
            dispatch(removeGuestItem(prodId));
            toast("Item removed from cart", { icon: "🗑️" });
            return;
        }

        try {
            await removeCartItem(item._id);
            const response = await getMyCart();
            dispatch(setCart(response.cart));
            toast("Item removed from cart", { icon: "🗑️" });
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to remove item");
        }
    };

    const subtotal = activeCart.reduce(
        (acc, item) => acc + (item.product?.price || 0) * item.quantity,
        0
    );

    const handleCheckout = () => {
        if (!isAuthenticated) {
            toast("Please sign in to proceed with checkout", { icon: "🔒" });
            navigate("/login");
            return;
        }
        navigate("/checkout");
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                
                {/* Header */}
                <div className="mb-10 pb-6 border-b border-slate-200">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        Shopping Cart
                    </h1>
                    <p className="text-slate-500 font-medium text-sm mt-3">
                        You have <strong className="text-purple-600">{activeCart.length}</strong> {activeCart.length === 1 ? "item" : "items"} in your cart.
                    </p>
                </div>

                {/* Guest Cart Notice */}
                {!isAuthenticated && activeCart.length > 0 && (
                    <div className="mb-10 p-5 bg-white shadow-sm border border-slate-100 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">Checking out as a Guest</p>
                                <p className="text-xs font-medium text-slate-500 mt-0.5">
                                    Sign in to save your cart across all devices and earn rewards.
                                </p>
                            </div>
                        </div>
                        <Link to="/login" className="bg-white border border-slate-200 text-slate-700 hover:text-purple-700 hover:border-purple-300 shadow-sm transition-all text-xs font-bold py-2.5 px-6 rounded-xl shrink-0 uppercase tracking-widest">
                            Sign In Now
                        </Link>
                    </div>
                )}

                {activeCart.length === 0 ? (
                    /* Empty Cart */
                    <div className="py-24 bg-white shadow-sm border border-slate-100 rounded-3xl flex flex-col items-center text-center max-w-2xl mx-auto">
                        <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-8">
                            <ShoppingBag className="w-10 h-10 text-purple-600" />
                        </div>

                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900" style={{ fontFamily: "var(--font-heading)" }}>
                            Your Cart is Empty
                        </h2>

                        <p className="text-slate-500 font-medium mt-3 text-sm max-w-sm">
                            Looks like you haven't added anything to your cart yet. Discover our premium collections.
                        </p>

                        <Link to="/" className="mt-10 bg-purple-600 text-white font-bold py-3.5 px-8 rounded-xl hover:bg-purple-700 shadow-md shadow-purple-200 transition-all text-sm uppercase tracking-widest">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    /* Cart Items + Summary Grid */
                    <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                        
                        {/* Items List */}
                        <div className="lg:col-span-8 space-y-4">
                            {activeCart.map((item) => {
                                const prod = item.product || item;
                                const imgUrl = prod.images?.[0]?.url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=400";

                                return (
                                    <div
                                        key={item._id || prod._id}
                                        className="bg-white shadow-sm border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-6 items-center transition-all hover:shadow-md"
                                    >
                                        {/* Image */}
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                                            <img
                                                src={imgUrl}
                                                alt={prod.title}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 w-full text-center sm:text-left">
                                            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase tracking-widest mb-2">
                                                {prod.category}
                                            </span>
                                            <Link to={`/product/${prod._id}`}>
                                                <h3 className="text-base font-bold text-slate-900 line-clamp-1 hover:text-purple-600 transition-colors">
                                                    {prod.title}
                                                </h3>
                                            </Link>
                                            <p className="text-sm font-medium text-slate-500 mt-1">
                                                ₹{prod.price?.toLocaleString("en-IN")} each
                                            </p>
                                        </div>

                                        {/* Actions & Price */}
                                        <div className="flex flex-col sm:items-end gap-4 w-full sm:w-auto">
                                            <div className="flex items-center justify-between sm:justify-end w-full gap-4">
                                                
                                                {/* Quantity Stepper */}
                                                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200">
                                                    <button
                                                        onClick={() => handleQuantity(item, item.quantity - 1)}
                                                        disabled={item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-40 rounded-l-xl"
                                                        aria-label="Decrease quantity"
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-bold text-slate-900">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleQuantity(item, item.quantity + 1)}
                                                        className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors rounded-r-xl"
                                                        aria-label="Increase quantity"
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemove(item)}
                                                    className="w-8 h-8 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                                                    title="Remove item"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="text-center sm:text-right w-full pt-4 sm:pt-0 border-t border-slate-100 sm:border-0">
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Total</p>
                                                <p className="text-lg font-black text-slate-900">
                                                    ₹{((prod.price || 0) * item.quantity)?.toLocaleString("en-IN")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-4 bg-white shadow-lg shadow-slate-200/50 rounded-3xl border border-slate-100 p-6 sm:p-8 sticky top-28">
                            <h2 className="text-lg font-extrabold text-slate-900 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 text-sm font-medium text-slate-600">
                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span>Subtotal</span>
                                    <span className="font-bold text-slate-900">₹{subtotal.toLocaleString("en-IN")}</span>
                                </div>

                                <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                    <span>Shipping</span>
                                    <span className="font-bold text-emerald-600 uppercase tracking-widest text-xs">FREE</span>
                                </div>

                                <div className="pt-6 mt-2 flex flex-col gap-2 border-t border-slate-100">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Total Payable</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-3xl font-black text-slate-900 tracking-tight">
                                            ₹{subtotal.toLocaleString("en-IN")}
                                        </span>
                                        <span className="text-xs font-bold text-slate-400">INR</span>
                                    </div>
                                </div>
                            </div>

                            {/* Checkout CTA */}
                            <button
                                onClick={handleCheckout}
                                className="w-full mt-8 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold py-4 transition-all shadow-md shadow-purple-200 flex items-center justify-center gap-2 text-sm"
                            >
                                <span>Proceed to Checkout</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>

                            {/* Safe checkout badge */}
                            <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-400">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>100% Safe & Encrypted</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;