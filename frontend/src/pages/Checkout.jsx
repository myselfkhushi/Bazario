import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    MapPin,
    Truck,
    ShieldCheck,
    CreditCard,
    ShoppingBag,
    ArrowLeft,
    AlertCircle,
    Phone,
    User,
    Home,
    Building2,
    Lock,
} from "lucide-react";
import toast from "react-hot-toast";

import { getMyCart } from "../features/cart/cartAPI";
import {
    createPaymentOrder,
    verifyPayment,
} from "../features/payment/paymentAPI";

const SAVED_ADDRESS_KEY = "bazario_shipping_address";

const INDIAN_STATES = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Jammu & Kashmir",
];

function Checkout() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Shipping Address State
    const [address, setAddress] = useState(() => {
        try {
            const saved = localStorage.getItem(SAVED_ADDRESS_KEY);
            if (saved) return JSON.parse(saved);
        } catch (e) {}
        return {
            fullName: "",
            phone: "",
            street: "",
            city: "",
            state: "Delhi",
            pincode: "",
        };
    });

    const [addressErrors, setAddressErrors] = useState({});

    // Auto-fill full name if available and not yet set
    useEffect(() => {
        if (user?.name && !address.fullName) {
            setAddress((prev) => ({ ...prev, fullName: user.name }));
        }
    }, [user]);

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await getMyCart();
                setCart(response.cart || []);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress((prev) => ({ ...prev, [name]: value }));
        if (addressErrors[name]) {
            setAddressErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateAddress = () => {
        const errors = {};
        if (!address.fullName.trim()) {
            errors.fullName = "Receiver's full name is required";
        }

        const cleanPhone = address.phone.trim().replace(/\D/g, "");
        if (!cleanPhone) {
            errors.phone = "Mobile phone number is required";
        } else if (cleanPhone.length !== 10) {
            errors.phone = "Enter a valid 10-digit mobile number";
        }

        if (!address.street.trim()) {
            errors.street = "Flat, house no., building, or street is required";
        }

        if (!address.city.trim()) {
            errors.city = "City / District is required";
        }

        if (!address.state.trim()) {
            errors.state = "State is required";
        }

        const cleanPin = address.pincode.trim().replace(/\D/g, "");
        if (!cleanPin) {
            errors.pincode = "Postal PIN code is required";
        } else if (cleanPin.length !== 6) {
            errors.pincode = "Enter a valid 6-digit postal PIN code";
        }

        setAddressErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const subtotal = cart.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );

    const deliveryCharge = 0;
    const total = subtotal + deliveryCharge;

    const handlePayment = async () => {
        if (!validateAddress()) {
            toast.error("Please fill in a complete delivery address");
            const addrSection = document.getElementById("shipping-address-card");
            if (addrSection) {
                addrSection.scrollIntoView({ behavior: "smooth" });
            }
            return;
        }

        try {
            setPaymentLoading(true);

            const response = await createPaymentOrder();

            const option = {
                key: response.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_T3u8OApYJFjtRj",
                amount: response.razorpayOrder.amount,
                currency: response.razorpayOrder.currency,
                order_id: response.razorpayOrder.id,
                name: "Bazario",
                description: "Order Checkout Payment",
                prefill: {
                    name: address.fullName,
                    contact: address.phone,
                    email: user?.email || "",
                },
                handler: async function (paymentResponse) {
                    try {
                        await verifyPayment({
                            ...paymentResponse,
                            shippingAddress: {
                                fullName: address.fullName.trim(),
                                phone: address.phone.trim(),
                                street: address.street.trim(),
                                city: address.city.trim(),
                                state: address.state.trim(),
                                pincode: address.pincode.trim(),
                            },
                        });
                        localStorage.setItem(SAVED_ADDRESS_KEY, JSON.stringify(address));
                        toast.success("Order placed successfully! 🎉");
                        navigate("/orders");
                    } catch (error) {
                        console.error(error);
                        toast.error(
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
                    color: "#9333ea",
                },
            };

            const razor = new window.Razorpay(option);
            razor.open();
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                    "Unable to process payment order"
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
                        <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 mb-2">Cart is empty</h1>
                    <p className="text-sm font-medium text-slate-500 mb-8">
                        You have no items in your cart to checkout.
                    </p>
                    <Link
                        to="/shop"
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
                            <ArrowLeft className="w-3.5 h-3.5" />
                            Back to Cart
                        </Link>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-600">
                            <Lock className="w-3.5 h-3.5" />
                            Secure Checkout
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
                <div className="mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                        Checkout & Shipping
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Please enter your delivery details to complete your order.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
                    
                    {/* LEFT COLUMN: ADDRESS & ORDER REVIEW */}
                    <div className="space-y-8">

                        {/* 1. SHIPPING ADDRESS FORM */}
                        <section id="shipping-address-card" className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                        1
                                    </div>
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-purple-600" />
                                        Delivery Address
                                    </h2>
                                </div>
                                <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full border border-purple-200">
                                    Required
                                </span>
                            </div>

                            <div className="p-6 sm:p-8 space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    
                                    {/* Full Name */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">
                                            Receiver's Full Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={address.fullName}
                                                onChange={handleAddressChange}
                                                placeholder="e.g. Khushi Kumari"
                                                className={`w-full bg-slate-50 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                    addressErrors.fullName ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                                }`}
                                            />
                                        </div>
                                        {addressErrors.fullName && (
                                            <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                {addressErrors.fullName}
                                            </p>
                                        )}
                                    </div>

                                    {/* Mobile Phone */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">
                                            10-Digit Mobile Number *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 text-sm font-semibold pointer-events-none">
                                                <Phone className="w-4 h-4" />
                                                <span className="text-xs text-slate-400">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                maxLength={10}
                                                value={address.phone}
                                                onChange={handleAddressChange}
                                                placeholder="9876543210"
                                                className={`w-full bg-slate-50 border rounded-xl py-3 pl-16 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                    addressErrors.phone ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                                }`}
                                            />
                                        </div>
                                        {addressErrors.phone && (
                                            <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                {addressErrors.phone}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Street Address */}
                                <div>
                                    <label className="block text-xs font-bold text-slate-700 mb-2">
                                        Flat, House no., Apartment, Street, Area *
                                    </label>
                                    <div className="relative">
                                        <Home className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
                                        <textarea
                                            rows={2}
                                            name="street"
                                            value={address.street}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. Flat 402, Royal Palms, Sector 18, Near Central Park"
                                            className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                addressErrors.street ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                            }`}
                                        />
                                    </div>
                                    {addressErrors.street && (
                                        <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                            {addressErrors.street}
                                        </p>
                                    )}
                                </div>

                                {/* City, State, PIN Code */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    
                                    {/* City */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">
                                            City / District *
                                        </label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="city"
                                                value={address.city}
                                                onChange={handleAddressChange}
                                                placeholder="e.g. New Delhi"
                                                className={`w-full bg-slate-50 border rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                    addressErrors.city ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                                }`}
                                            />
                                        </div>
                                        {addressErrors.city && (
                                            <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                {addressErrors.city}
                                            </p>
                                        )}
                                    </div>

                                    {/* State */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">
                                            State *
                                        </label>
                                        <select
                                            name="state"
                                            value={address.state}
                                            onChange={handleAddressChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-3 text-sm text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all cursor-pointer"
                                        >
                                            {INDIAN_STATES.map((st) => (
                                                <option key={st} value={st}>
                                                    {st}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* PIN Code */}
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-2">
                                            PIN Code *
                                        </label>
                                        <input
                                            type="text"
                                            maxLength={6}
                                            name="pincode"
                                            value={address.pincode}
                                            onChange={handleAddressChange}
                                            placeholder="e.g. 110001"
                                            className={`w-full bg-slate-50 border rounded-xl py-3 px-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                addressErrors.pincode ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                            }`}
                                        />
                                        {addressErrors.pincode && (
                                            <p className="text-red-500 text-xs mt-1.5 font-medium flex items-center gap-1">
                                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                                {addressErrors.pincode}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. ORDER ITEMS REVIEW */}
                        <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                        2
                                    </div>
                                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4 text-slate-700" />
                                        Review Items ({cart.length})
                                    </h2>
                                </div>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {cart.map((item) => (
                                    <div key={item._id} className="p-6 flex flex-col sm:flex-row gap-6 items-center">
                                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                                            <img
                                                src={item.product?.images?.[0]?.url || "https://via.placeholder.com/200"}
                                                alt={item.product?.title || "Product"}
                                                className="w-full h-full object-cover p-1"
                                            />
                                            <span className="absolute -top-1 -right-1 min-w-[22px] h-5 px-1 bg-purple-600 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                                {item.quantity}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                                                {item.product?.brand || item.product?.category || "General"}
                                            </p>
                                            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 mt-0.5">
                                                {item.product?.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Qty: <span className="font-semibold text-slate-800">{item.quantity}</span> × ₹{(item.product?.price || 0).toLocaleString("en-IN")}
                                            </p>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <p className="font-black text-slate-900 text-base">
                                                ₹{((item.product?.price || 0) * item.quantity).toLocaleString("en-IN")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* 3. DELIVERY PROMISE BANNER */}
                        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                                    Express Free Delivery Guaranteed
                                </h4>
                                <p className="text-xs text-emerald-700 mt-0.5 font-medium">
                                    Your order will be safely dispatched to your doorstep within 3–5 business days.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PAYMENT SUMMARY */}
                    <aside className="lg:sticky lg:top-24">
                        <div className="bg-white rounded-3xl shadow-lg shadow-slate-200/60 border border-slate-200 overflow-hidden">
                            
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-base font-extrabold text-slate-900">
                                        Order Summary
                                    </h2>
                                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5" />
                                    </div>
                                </div>

                                {/* Order price breakdown */}
                                <div className="space-y-3 text-sm font-medium text-slate-600">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span>Items Subtotal</span>
                                        <span className="font-bold text-slate-900">
                                            ₹{subtotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span>Shipping & Handling</span>
                                        <span className="text-emerald-600 font-bold uppercase tracking-widest text-xs bg-emerald-50 px-2 py-0.5 rounded-md">
                                            Free
                                        </span>
                                    </div>
                                </div>

                                {/* Destination summary pill */}
                                {address.city && address.pincode && (
                                    <div className="mt-4 p-3 bg-purple-50/60 rounded-xl border border-purple-100 flex items-start gap-2 text-xs">
                                        <MapPin className="w-3.5 h-3.5 text-purple-600 shrink-0 mt-0.5" />
                                        <div className="text-purple-900 leading-tight">
                                            <span className="font-bold">Shipping to:</span> {address.fullName || "Customer"}, {address.city} - {address.pincode}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t border-slate-100 my-6" />

                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                                        Total Amount Payable
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
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
                                    className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl py-4 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 hover:-translate-y-0.5 transition-all uppercase tracking-widest cursor-pointer"
                                >
                                    {paymentLoading ? (
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Lock className="w-4 h-4" />
                                            <span>Pay Now • ₹{total.toLocaleString("en-IN")}</span>
                                        </>
                                    )}
                                </button>
                                
                                <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span>Razorpay Secure Encrypted</span>
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