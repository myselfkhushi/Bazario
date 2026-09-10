import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaLock,
    FaShieldAlt,
    FaTruck,
    FaCreditCard,
    FaCheck,
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
        (sum, item) =>
            sum + item.product.price * item.quantity,
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

                name: "ShopHub",
                description: "Order Payment",

                handler: async function (paymentResponse) {
                    try {
                        await verifyPayment(paymentResponse);

                        alert("Payment Successful");

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
                    color: "#4f46e5",
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
            <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">

                <div className="flex flex-col items-center">

                    <div className="relative w-14 h-14">

                        <div className="absolute inset-0 rounded-full border-4 border-indigo-100" />

                        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-indigo-600 animate-spin" />

                    </div>

                    <p className="mt-5 text-sm font-medium text-slate-500">
                        Preparing your checkout...
                    </p>

                </div>

            </div>
        );
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center px-6">

                <div className="max-w-md w-full text-center">

                    <div className="relative mx-auto w-28 h-28">

                        <div className="absolute inset-0 bg-indigo-100 rounded-[2rem] rotate-6" />

                        <div className="absolute inset-0 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-indigo-600">

                            <FaShoppingBag size={38} />

                        </div>

                    </div>

                    <h1 className="text-3xl font-extrabold text-slate-900 mt-9">
                        Your cart is empty
                    </h1>

                    <p className="text-slate-500 mt-3 leading-7">
                        Looks like you haven't added anything to your
                        cart yet. Explore our products and find something
                        you love.
                    </p>

                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-7 py-3.5 rounded-xl font-semibold transition shadow-lg shadow-indigo-200"
                    >
                        Start Shopping
                        <FaChevronRight size={12} />
                    </Link>

                </div>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f7f8fc]">

            {/* HEADER */}

            <header className="bg-white border-b border-slate-200">

                <div className="max-w-7xl mx-auto px-5 sm:px-8 py-5">

                    <div className="flex items-center justify-between">

                        <Link
                            to="/cart"
                            className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition"
                        >
                            <FaArrowLeft size={12} />
                            Back to cart
                        </Link>

                        <div className="flex items-center gap-2 text-sm text-slate-400">

                            <FaLock
                                size={11}
                                className="text-emerald-500"
                            />

                            Secure Checkout

                        </div>

                    </div>

                </div>

            </header>

            {/* MAIN */}

            <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10 lg:py-14">

                {/* TITLE */}

                <div className="max-w-3xl mb-10">

                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                        Checkout
                        <span className="w-8 h-px bg-indigo-200" />
                        Order Review
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
                        Complete your order
                    </h1>

                    <p className="text-slate-500 mt-3 text-base sm:text-lg">
                        Review your items and continue to secure payment.
                    </p>

                </div>

                {/* PROGRESS */}

                <div className="hidden md:flex items-center max-w-xl mb-10">

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">
                            <FaCheck size={12} />
                        </div>

                        <span className="text-sm font-bold text-slate-900">
                            Cart
                        </span>

                    </div>

                    <div className="w-20 h-px bg-indigo-600 mx-4" />

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm">
                            2
                        </div>

                        <span className="text-sm font-bold text-indigo-600">
                            Checkout
                        </span>

                    </div>

                    <div className="w-20 h-px bg-slate-200 mx-4" />

                    <div className="flex items-center gap-3">

                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-sm">
                            3
                        </div>

                        <span className="text-sm font-medium text-slate-400">
                            Confirmation
                        </span>

                    </div>

                </div>

                {/* CONTENT */}

                <div className="grid lg:grid-cols-[1fr_420px] gap-8 items-start">

                    {/* LEFT */}

                    <section>

                        <div className="bg-white rounded-[1.75rem] border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.05)] overflow-hidden">

                            <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between">

                                <div>

                                    <h2 className="text-xl font-extrabold text-slate-900">
                                        Order items
                                    </h2>

                                    <p className="text-sm text-slate-400 mt-1">
                                        {cart.length}{" "}
                                        {cart.length === 1
                                            ? "item"
                                            : "items"}{" "}
                                        in your order
                                    </p>

                                </div>

                                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">

                                    <FaShoppingBag />

                                </div>

                            </div>

                            <div className="divide-y divide-slate-100">

                                {cart.map((item) => (

                                    <div
                                        key={item._id}
                                        className="p-6 sm:p-7 flex gap-5 sm:gap-6 hover:bg-slate-50/50 transition"
                                    >

                                        {/* IMAGE */}

                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-2xl bg-slate-100 overflow-hidden">

                                            <img
                                                src={
                                                    item.product
                                                        .images?.[0]
                                                        ?.url
                                                }
                                                alt={
                                                    item.product.title
                                                }
                                                className="w-full h-full object-cover"
                                            />

                                            <span className="absolute top-2 right-2 min-w-6 h-6 px-1.5 bg-white/95 backdrop-blur rounded-full flex items-center justify-center text-xs font-bold text-slate-800 shadow">
                                                ×{item.quantity}
                                            </span>

                                        </div>

                                        {/* DETAILS */}

                                        <div className="flex-1 min-w-0 flex flex-col justify-between">

                                            <div>

                                                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500">
                                                    {
                                                        item.product
                                                            .category
                                                    }
                                                </p>

                                                <h3 className="font-bold text-slate-900 text-lg sm:text-xl mt-1 leading-tight">
                                                    {
                                                        item.product
                                                            .title
                                                    }
                                                </h3>

                                            </div>

                                            <div className="flex items-end justify-between gap-4 mt-5">

                                                <div>

                                                    <p className="text-xs text-slate-400">
                                                        Unit price
                                                    </p>

                                                    <p className="font-semibold text-slate-700 mt-1">
                                                        ₹
                                                        {item.product.price.toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                </div>

                                                <div className="text-right">

                                                    <p className="text-xs text-slate-400">
                                                        Item total
                                                    </p>

                                                    <p className="font-extrabold text-slate-900 text-lg mt-1">
                                                        ₹
                                                        {(
                                                            item
                                                                .product
                                                                .price *
                                                            item.quantity
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))}

                            </div>

                        </div>

                        {/* DELIVERY CARD */}

                        <div className="mt-6 bg-white rounded-[1.75rem] border border-slate-200 shadow-[0_10px_40px_rgba(15,23,42,0.04)] p-7">

                            <div className="flex items-start gap-4">

                                <div className="w-12 h-12 shrink-0 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                    <FaTruck />
                                </div>

                                <div className="flex-1">

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">

                                        <div>

                                            <h3 className="font-extrabold text-slate-900">
                                                Standard Delivery
                                            </h3>

                                            <p className="text-sm text-slate-400 mt-1">
                                                Estimated delivery in 3–7
                                                business days
                                            </p>

                                        </div>

                                        <span className="inline-flex w-fit px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold">
                                            FREE
                                        </span>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </section>

                    {/* RIGHT */}

                    <aside>

                        <div className="lg:sticky lg:top-24">

                            <div className="relative bg-slate-900 rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-300">

                                {/* DECORATION */}

                                <div className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-indigo-500/20 blur-2xl" />

                                <div className="absolute -bottom-24 -left-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />

                                <div className="relative p-7 sm:p-8">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-indigo-300 text-xs uppercase tracking-[0.2em] font-bold">
                                                Summary
                                            </p>

                                            <h2 className="text-2xl font-extrabold text-white mt-2">
                                                Order total
                                            </h2>

                                        </div>

                                        <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center text-indigo-300">
                                            <FaCreditCard />
                                        </div>

                                    </div>

                                    {/* PRICE */}

                                    <div className="mt-8 space-y-4">

                                        <div className="flex justify-between text-slate-300">

                                            <span>
                                                Subtotal
                                            </span>

                                            <span className="font-semibold text-white">
                                                ₹
                                                {subtotal.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </span>

                                        </div>

                                        <div className="flex justify-between text-slate-300">

                                            <span>
                                                Delivery
                                            </span>

                                            <span className="font-bold text-emerald-400">
                                                FREE
                                            </span>

                                        </div>

                                    </div>

                                    <div className="border-t border-white/10 my-7" />

                                    <div>

                                        <p className="text-sm text-slate-400">
                                            Total payable
                                        </p>

                                        <div className="flex items-end justify-between gap-3 mt-1">

                                            <h3 className="text-4xl font-black text-white tracking-tight">
                                                ₹
                                                {total.toLocaleString(
                                                    "en-IN"
                                                )}
                                            </h3>

                                            <span className="text-xs text-slate-500 mb-1">
                                                INR
                                            </span>

                                        </div>

                                    </div>

                                    {/* PAYMENT */}

                                    <button
                                        onClick={handlePayment}
                                        disabled={paymentLoading}
                                        className="w-full mt-8 bg-white hover:bg-indigo-50 disabled:opacity-60 text-slate-900 py-4 rounded-xl font-extrabold flex items-center justify-center gap-3 transition shadow-xl"
                                    >

                                        <FaLock className="text-indigo-600" />

                                        {paymentLoading
                                            ? "Processing..."
                                            : "Continue to Payment"}

                                    </button>

                                    <p className="text-center text-xs text-slate-500 mt-4">
                                        You will be redirected to Razorpay
                                        for secure payment.
                                    </p>

                                </div>

                            </div>

                            {/* TRUST */}

                            <div className="grid grid-cols-2 gap-3 mt-4">

                                <div className="bg-white border border-slate-200 rounded-2xl p-4">

                                    <FaShieldAlt className="text-indigo-500 mb-3" />

                                    <p className="text-xs font-bold text-slate-800">
                                        Secure payment
                                    </p>

                                    <p className="text-[11px] text-slate-400 mt-1 leading-4">
                                        Protected checkout
                                    </p>

                                </div>

                                <div className="bg-white border border-slate-200 rounded-2xl p-4">

                                    <FaLock className="text-emerald-500 mb-3" />

                                    <p className="text-xs font-bold text-slate-800">
                                        Your data is safe
                                    </p>

                                    <p className="text-[11px] text-slate-400 mt-1 leading-4">
                                        Encrypted transaction
                                    </p>

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