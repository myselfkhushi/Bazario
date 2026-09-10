import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaLock,
    FaShieldAlt,
    FaTruck,
    FaCreditCard,
    FaShoppingBag,
    FaChevronRight,
} from "react-icons/fa";

import { getMyCart } from "../features/cart/cartAPI";
import {
    createPaymentOrder,
    verifyPayment,
} from "../features/payment/paymentAPI";

function Checkout() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getMyCart();
                setCart(response.cart || []);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const subtotal = cart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const deliveryCharge = 0;
    const total = subtotal + deliveryCharge;

    const handlePayment = async () => {
        try {
            setPaymentLoading(true);

            const response = await createPaymentOrder();

            const option = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: response.razorpayOrder.amount,
                currency: response.razorpayOrder.currency,
                order_id: response.razorpayOrder.id,
                name: "Bazario",
                description: "Order Payment",
                handler: async function (paymentResponse) {
                    try {
                        await verifyPayment(paymentResponse);
                        navigate("/orders");
                    } catch (error) {
                        console.log(error);
                        alert(
                            error.response?.data?.message ||
                                "Payment verification failed"
                        );
                    } finally {
                        setPaymentLoading(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setPaymentLoading(false);
                    },
                },
                theme: {
                    color: "#9333ea", // purple-600
                },
            };

            const razor = new window.Razorpay(option);
            razor.open();
        } catch (error) {
            console.log(error);
            alert(
                error.response?.data?.message ||
                    "Unable to process payment"
            );
            setPaymentLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
                    <p className="mt-4 text-xs font-bold uppercase tracking-widest text-slate-400">
                        Preparing Checkout
                    </p>
                </div>
            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
                <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-slate-100 text-center">
                    <div className="w-20 h-20 mx-auto bg-purple-50 rounded-full flex items-center justify-center text-purple-600 mb-6">
                        <FaShoppingBag size={32} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Cart is empty</h1>
                    <p className="text-sm font-medium text-slate-500 mb-8">
                        You have no items in your cart to checkout.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md shadow-purple-200 px-8 py-3.5 font-bold text-sm transition-all uppercase tracking-widest"
                    >
                        Return to Shop
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <Link
                            to="/cart"
                            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 hover:text-purple-600 transition-colors"
                        >
                            <FaArrowLeft size={10} />
                            Back to Cart
                        </Link>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
                            <FaLock size={10} />
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        Complete your order
                    </h1>
                </div>

                {/* CONTENT */}
                <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
                    
                    {/* LEFT PANE: ORDER ITEMS */}
                    <section>
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <h2 className="text-sm font-bold uppercase tracking-widest text-slate-900">
                                    Order Items
                                </h2>
                                <span className="text-xs font-bold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                    {cart.length} {cart.length === 1 ? "Item" : "Items"}
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {cart.map((item) => (
                                    <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6">
                                        {/* IMAGE */}
                                        <div className="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 bg-slate-50 rounded-2xl border border-slate-100">
                                            <img
                                                src={item.product.images?.[0]?.url}
                                                alt={item.product.title}
                                                className="w-full h-full object-contain p-2"
                                            />
                                            <span className="absolute -top-2 -right-2 min-w-[24px] h-6 px-1.5 bg-slate-900 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                                {item.quantity}
                                            </span>
                                        </div>

                                        {/* DETAILS */}
                                        <div className="flex-1 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-slate-900 text-base sm:text-lg leading-tight">
                                                    {item.product.title}
                                                </h3>
                                                <p className="text-xs font-bold uppercase tracking-widest text-purple-600 mt-2 block">
                                                    {item.product.category}
                                                </p>
                                            </div>
                                            <div className="flex items-end justify-between gap-4 mt-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div>
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                                                        Unit Price
                                                    </p>
                                                    <p className="font-semibold text-slate-700 text-sm">
                                                        ₹{item.product.price.toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">
                                                        Total
                                                    </p>
                                                    <p className="font-black text-slate-900 text-base">
                                                        ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* DELIVERY */}
                        <div className="mt-8 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 flex items-center gap-5">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                                    <FaTruck className="text-xl" />
                                </div>
                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-900">
                                            Standard Delivery
                                        </h3>
                                        <p className="text-xs font-medium text-slate-500 mt-0.5">
                                            Estimated delivery in 3–7 business days
                                        </p>
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">
                                        Free
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* RIGHT PANE: PAYMENT SUMMARY */}
                    <aside className="lg:sticky lg:top-28">
                        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
                            
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-base font-extrabold text-slate-900">
                                        Payment Summary
                                    </h2>
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                        <FaCreditCard />
                                    </div>
                                </div>

                                <div className="space-y-4 text-sm font-medium text-slate-600">
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-slate-900">
                                            ₹{subtotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <span>Delivery</span>
                                        <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs">
                                            Free
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 my-6" />

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                                        Total Payable
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">
                                            ₹{total.toLocaleString("en-IN")}
                                        </h3>
                                        <span className="text-xs font-bold text-slate-400">
                                            INR
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={handlePayment}
                                    disabled={paymentLoading}
                                    className="w-full mt-8 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl py-4 font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-purple-200 transition-all uppercase tracking-widest"
                                >
                                    {paymentLoading ? (
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <FaLock />
                                            Pay Now
                                        </>
                                    )}
                                </button>
                                
                                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <FaShieldAlt className="text-emerald-500" />
                                    <span>Secure Razorpay Processing</span>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default Checkout;