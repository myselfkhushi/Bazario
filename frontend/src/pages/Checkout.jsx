import { useEffect, useState, useMemo } from "react";
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
    Search,
    Plus,
    ChevronRight,
    Check,
    X,
    Trash2,
    Navigation,
    Clock,
} from "lucide-react";
import toast from "react-hot-toast";

import { getMyCart } from "../features/cart/cartAPI";
import { getMyOrders } from "../features/order/orderAPI";
import {
    createPaymentOrder,
    verifyPayment,
} from "../features/payment/paymentAPI";

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

// Helper to compute dynamic estimated delivery date (3-4 business days)
function getDeliveryEstimate() {
    const target = new Date();
    target.setDate(target.getDate() + 4);
    const dateFormatted = target.toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
    });
    return {
        formattedDate: dateFormatted,
        duration: "3–4 Business Days",
    };
}

function Checkout() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);

    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentLoading, setPaymentLoading] = useState(false);

    // Dynamic Delivery Estimate (e.g. "Wed, 25 Nov")
    const deliveryEstimate = useMemo(() => getDeliveryEstimate(), []);

    // Storage keys scoped to user or guest
    const savedAddressesKey = `bazario_saved_addresses_${user?._id || "guest"}`;
    const activeAddressKey = `bazario_active_address_${user?._id || "guest"}`;

    // Saved addresses list
    const [savedAddresses, setSavedAddresses] = useState(() => {
        try {
            const raw = localStorage.getItem(savedAddressesKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed) && parsed.length > 0) return parsed;
            }
            // Check legacy single address key
            const legacy = localStorage.getItem("bazario_shipping_address");
            if (legacy) {
                const parsedLegacy = JSON.parse(legacy);
                if (parsedLegacy?.street) {
                    return [{ ...parsedLegacy, id: "legacy_addr_1" }];
                }
            }
        } catch (e) {
            console.error(e);
        }
        return [];
    });

    // Currently selected active delivery address
    const [address, setAddress] = useState(() => {
        try {
            const activeRaw = localStorage.getItem(activeAddressKey);
            if (activeRaw) {
                const parsed = JSON.parse(activeRaw);
                if (parsed?.street) return parsed;
            }
            const savedRaw = localStorage.getItem(savedAddressesKey);
            if (savedRaw) {
                const parsedList = JSON.parse(savedRaw);
                if (Array.isArray(parsedList) && parsedList.length > 0) {
                    return parsedList[0];
                }
            }
        } catch (e) {}

        return {
            id: "default_addr",
            fullName: "",
            phone: "",
            street: "",
            city: "",
            state: "Rajasthan",
            pincode: "",
        };
    });

    // Drawer / Modal states
    const [showAddressDrawer, setShowAddressDrawer] = useState(false);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [locating, setLocating] = useState(false);

    // Form state for adding/editing a new address
    const [newAddressForm, setNewAddressForm] = useState({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "Rajasthan",
        pincode: "",
    });
    const [formErrors, setFormErrors] = useState({});

    // Keep user's full name prefilled if not set
    useEffect(() => {
        if (user?.name) {
            setAddress((prev) => (prev.fullName ? prev : { ...prev, fullName: user.name }));
            setNewAddressForm((prev) => (prev.fullName ? prev : { ...prev, fullName: user.name }));
        }
    }, [user]);

    // Fetch Cart & Previous Order Addresses
    useEffect(() => {
        const fetchCartAndOrders = async () => {
            try {
                // 1. Fetch Cart
                const cartRes = await getMyCart();
                setCart(cartRes.cart || []);

                // 2. Extract previously used shipping addresses from past orders
                try {
                    const orderRes = await getMyOrders();
                    if (orderRes?.orders?.length > 0) {
                        const pastAddresses = orderRes.orders
                            .map((o) => o.shippingAddress)
                            .filter((a) => a && a.street && a.city);

                        if (pastAddresses.length > 0) {
                            setSavedAddresses((prev) => {
                                const merged = [...prev];
                                pastAddresses.forEach((pa) => {
                                    const exists = merged.some(
                                        (m) =>
                                            m.street?.trim().toLowerCase() === pa.street?.trim().toLowerCase() &&
                                            m.pincode === pa.pincode
                                    );
                                    if (!exists) {
                                        merged.push({
                                            id: `order_addr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                                            fullName: pa.fullName || user?.name || "Customer",
                                            phone: pa.phone || "",
                                            street: pa.street || "",
                                            city: pa.city || "",
                                            state: pa.state || "Rajasthan",
                                            pincode: pa.pincode || "",
                                        });
                                    }
                                });
                                localStorage.setItem(savedAddressesKey, JSON.stringify(merged));
                                return merged;
                            });
                        }
                    }
                } catch (orderErr) {
                    console.log("Past orders fetch skipped / guest user", orderErr);
                }
            } catch (error) {
                console.error("Cart fetch error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCartAndOrders();
    }, [savedAddressesKey, user]);

    // Save savedAddresses list to localStorage whenever updated
    const persistAddresses = (updatedList) => {
        setSavedAddresses(updatedList);
        try {
            localStorage.setItem(savedAddressesKey, JSON.stringify(updatedList));
        } catch (e) {
            console.error(e);
        }
    };

    // Select an address from the saved list
    const handleSelectAddress = (selectedAddr) => {
        setAddress(selectedAddr);
        try {
            localStorage.setItem(activeAddressKey, JSON.stringify(selectedAddr));
        } catch (e) {}
        setShowAddressDrawer(false);
        setIsAddingNew(false);
        toast.success(`Delivery address selected for ${selectedAddr.fullName || "order"}`);
    };

    // Delete a saved address
    const handleDeleteSavedAddress = (e, addrId) => {
        e.stopPropagation();
        const updated = savedAddresses.filter((a) => a.id !== addrId);
        persistAddresses(updated);
        toast.success("Address removed from saved list");
        if (address.id === addrId) {
            if (updated.length > 0) {
                setAddress(updated[0]);
            } else {
                setAddress({
                    id: "new_empty",
                    fullName: user?.name || "",
                    phone: "",
                    street: "",
                    city: "",
                    state: "Rajasthan",
                    pincode: "",
                });
            }
        }
    };

    // Geolocation: "Use my current location"
    const handleUseCurrentLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                try {
                    const { latitude, longitude } = pos.coords;
                    const res = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
                    );
                    const data = await res.json();

                    if (data && data.address) {
                        const addr = data.address;
                        const streetParts = [
                            addr.house_number,
                            addr.road,
                            addr.suburb || addr.neighbourhood,
                            addr.residential,
                        ].filter(Boolean);

                        const detectedStreet =
                            streetParts.length > 0
                                ? streetParts.join(", ")
                                : data.display_name.split(",").slice(0, 3).join(", ");

                        const detectedCity =
                            addr.city || addr.town || addr.village || addr.county || "Jaipur";
                        const detectedState = addr.state || "Rajasthan";
                        const detectedPin = addr.postcode
                            ? addr.postcode.replace(/\D/g, "").slice(0, 6)
                            : "";

                        setNewAddressForm((prev) => ({
                            ...prev,
                            fullName: prev.fullName || user?.name || "",
                            phone: prev.phone || "",
                            street: detectedStreet,
                            city: detectedCity,
                            state: detectedState,
                            pincode: detectedPin,
                        }));

                        setIsAddingNew(true);
                        toast.success("Location detected! Please verify your name & phone number.");
                    } else {
                        toast.error("Could not determine full address from coordinates.");
                        setIsAddingNew(true);
                    }
                } catch (err) {
                    console.error("Geocoding failed:", err);
                    toast.error("Failed to detect location address. Please enter manually.");
                    setIsAddingNew(true);
                } finally {
                    setLocating(false);
                }
            },
            (geoError) => {
                console.error("Geo error:", geoError);
                setLocating(false);
                toast.error("Location permission denied. Please add your address manually.");
                setIsAddingNew(true);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    };

    // Form inputs handling for new address
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setNewAddressForm((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    // Validate and save new address
    const handleSaveNewAddress = (e) => {
        e.preventDefault();
        const errors = {};

        if (!newAddressForm.fullName.trim()) {
            errors.fullName = "Full name is required";
        }

        const cleanPhone = newAddressForm.phone.trim().replace(/\D/g, "");
        if (!cleanPhone || cleanPhone.length !== 10) {
            errors.phone = "Enter a valid 10-digit mobile number";
        }

        if (!newAddressForm.street.trim()) {
            errors.street = "Street address / flat details are required";
        }

        if (!newAddressForm.city.trim()) {
            errors.city = "City is required";
        }

        if (!newAddressForm.state.trim()) {
            errors.state = "State is required";
        }

        const cleanPin = newAddressForm.pincode.trim().replace(/\D/g, "");
        if (!cleanPin || cleanPin.length !== 6) {
            errors.pincode = "Enter a valid 6-digit postal PIN code";
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            toast.error("Please fill in all address details correctly");
            return;
        }

        const newAddrObject = {
            id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            fullName: newAddressForm.fullName.trim(),
            phone: cleanPhone,
            street: newAddressForm.street.trim(),
            city: newAddressForm.city.trim(),
            state: newAddressForm.state.trim(),
            pincode: cleanPin,
        };

        const updated = [newAddrObject, ...savedAddresses];
        persistAddresses(updated);
        setAddress(newAddrObject);
        try {
            localStorage.setItem(activeAddressKey, JSON.stringify(newAddrObject));
        } catch (e) {}

        setIsAddingNew(false);
        setShowAddressDrawer(false);
        toast.success("New delivery address saved & selected! 🚀");
    };

    // Validate active address before payment
    const validateActiveAddress = () => {
        if (!address?.fullName?.trim()) return false;
        const cleanPhone = (address?.phone || "").replace(/\D/g, "");
        if (!cleanPhone || cleanPhone.length !== 10) return false;
        if (!address?.street?.trim()) return false;
        if (!address?.city?.trim()) return false;
        const cleanPin = (address?.pincode || "").replace(/\D/g, "");
        if (!cleanPin || cleanPin.length !== 6) return false;
        return true;
    };

    // Filter saved addresses by search query
    const filteredAddresses = useMemo(() => {
        if (!searchQuery.trim()) return savedAddresses;
        const q = searchQuery.toLowerCase().trim();
        return savedAddresses.filter(
            (addr) =>
                addr.fullName?.toLowerCase().includes(q) ||
                addr.street?.toLowerCase().includes(q) ||
                addr.city?.toLowerCase().includes(q) ||
                addr.pincode?.includes(q) ||
                addr.phone?.includes(q)
        );
    }, [savedAddresses, searchQuery]);

    // Cart pricing calculations
    const subtotal = cart.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
    );
    const deliveryCharge = 0; // Free express delivery
    const total = subtotal + deliveryCharge;

    // Razorpay Payment Handler
    const handlePayment = async () => {
        if (!validateActiveAddress()) {
            toast.error("Please select or add a complete delivery address");
            setShowAddressDrawer(true);
            return;
        }

        try {
            setPaymentLoading(true);

            const cleanStreet = (address.street || "").trim();
            const cleanPincode = (address.pincode || "").trim().replace(/\D/g, "");
            const cleanCity = (address.city || "").trim();
            const cleanState = (address.state || "Rajasthan").trim();
            const cleanFullName = (address.fullName || user?.name || "Customer").trim();
            const cleanPhone = (address.phone || "").trim().replace(/\D/g, "");

            const shippingPayload = {
                fullName: cleanFullName,
                phone: cleanPhone,
                street: cleanStreet,
                address: cleanStreet, // backward compatibility with controllers expecting 'address'
                city: cleanCity,
                state: cleanState,
                pincode: cleanPincode,
                postalCode: cleanPincode, // backward compatibility with controllers expecting 'postalCode'
            };

            const response = await createPaymentOrder({ shippingAddress: shippingPayload });

            const option = {
                key: response.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: response.razorpayOrder.amount,
                currency: response.razorpayOrder.currency,
                order_id: response.razorpayOrder.id,
                name: "Bazario",
                description: `Order Checkout - Delivery by ${deliveryEstimate.formattedDate}`,
                prefill: {
                    name: address.fullName,
                    contact: address.phone,
                    email: user?.email || "",
                },
                handler: async function (paymentResponse) {
                    try {
                        await verifyPayment({
                            ...paymentResponse,
                            shippingAddress: shippingPayload,
                        });

                        // Ensure this address is stored in saved addresses
                        const exists = savedAddresses.some(
                            (a) =>
                                a.street?.trim().toLowerCase() === shippingPayload.street.toLowerCase() &&
                                a.pincode === shippingPayload.pincode
                        );
                        if (!exists) {
                            const newSaved = [
                                { ...shippingPayload, id: `addr_${Date.now()}` },
                                ...savedAddresses,
                            ];
                            persistAddresses(newSaved);
                        }

                        toast.success("Order placed successfully! 🎉");
                        navigate("/orders");
                    } catch (error) {
                        console.error(error);
                        toast.error(
                            error.response?.data?.message || "Payment verification failed"
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
                error.response?.data?.message || "Unable to initialize payment order"
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

    const hasValidAddress = Boolean(
        address.fullName && address.phone && address.street && address.city && address.pincode
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-24">
            {/* HEADER */}
            <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
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
                            Secure 256-Bit Checkout
                        </div>
                    </div>
                </div>
            </header>

            {/* MAIN CONTENT */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
                <div className="mb-8">
                    <h1
                        className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        Checkout & Shipping
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">
                        Select your delivery address and review items to complete your order.
                    </p>
                </div>

                <div className="grid lg:grid-cols-[1fr_420px] gap-8 lg:gap-12 items-start">
                    {/* LEFT COLUMN: DELIVERY ADDRESS & ORDER REVIEW */}
                    <div className="space-y-8">
                        {/* 1. DELIVERY ADDRESS SECTION */}
                        <section
                            id="shipping-address-card"
                            className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
                        >
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
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAddingNew(false);
                                        setShowAddressDrawer(true);
                                    }}
                                    className="text-xs font-bold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3.5 py-1.5 rounded-xl border border-purple-200/80 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    <span>Change Address</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="p-6 sm:p-8">
                                {hasValidAddress ? (
                                    <div className="p-5 rounded-2xl border-2 border-purple-500/30 bg-purple-50/30 relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-3.5">
                                            <div className="w-11 h-11 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                                <Home className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-extrabold text-slate-900 text-base">
                                                        {address.fullName}
                                                    </span>
                                                    <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                                                        Selected Delivery
                                                    </span>
                                                </div>
                                                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                                    {address.street}, {address.city}, {address.state} - {address.pincode}
                                                </p>
                                                <p className="text-xs font-semibold text-slate-700 mt-1.5 flex items-center gap-1.5">
                                                    <Phone className="w-3.5 h-3.5 text-purple-600" />
                                                    <span>+91 {address.phone}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsAddingNew(false);
                                                setShowAddressDrawer(true);
                                            }}
                                            className="self-end sm:self-center px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-sm"
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 px-4 border-2 border-dashed border-slate-200 rounded-2xl">
                                        <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm">
                                            No delivery address selected
                                        </h3>
                                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-5">
                                            Please choose from your saved addresses or add a new address to continue checkout.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setShowAddressDrawer(true)}
                                            className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5 py-2.5 text-xs font-bold shadow-md shadow-purple-200 transition-all cursor-pointer"
                                        >
                                            <Plus className="w-4 h-4" />
                                            <span>Select / Add Delivery Address</span>
                                        </button>
                                    </div>
                                )}

                                {/* Expected Delivery Promise Highlight */}
                                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Clock className="w-4 h-4 text-purple-600 shrink-0" />
                                        <span className="font-medium">Estimated Delivery:</span>
                                        <span className="font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100">
                                            {deliveryEstimate.formattedDate} ({deliveryEstimate.duration})
                                        </span>
                                    </div>
                                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                                        <Check className="w-3.5 h-3.5" />
                                        Free Express Shipping
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* 2. ORDER ITEMS REVIEW SECTION */}
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
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                                    Delivery by {deliveryEstimate.formattedDate}
                                </span>
                            </div>

                            <div className="divide-y divide-slate-100">
                                {cart.map((item) => (
                                    <div
                                        key={item._id}
                                        className="p-6 flex flex-col sm:flex-row gap-6 items-center"
                                    >
                                        {/* Image div: full cover, zero padding, NO quantity badge */}
                                        <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
                                            <img
                                                src={
                                                    item.product?.images?.[0]?.url ||
                                                    "https://via.placeholder.com/200"
                                                }
                                                alt={item.product?.title || "Product"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-purple-600">
                                                {item.product?.brand || item.product?.category || "Bazario Official"}
                                            </p>
                                            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug line-clamp-1 mt-0.5">
                                                {item.product?.title}
                                            </h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Qty:{" "}
                                                <span className="font-bold text-slate-800">
                                                    {item.quantity}
                                                </span>{" "}
                                                × ₹{(item.product?.price || 0).toLocaleString("en-IN")}
                                            </p>
                                            <div className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                                                <Truck className="w-3.5 h-3.5" />
                                                <span>Arrives by {deliveryEstimate.formattedDate}</span>
                                            </div>
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
                        <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-2xl p-5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                                <Truck className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                                    Express Free Delivery Guaranteed
                                </h4>
                                <p className="text-xs text-emerald-700 mt-0.5 font-medium">
                                    Your order will arrive safely at your doorstep by{" "}
                                    <span className="font-bold text-emerald-900">
                                        {deliveryEstimate.formattedDate}
                                    </span>{" "}
                                    ({deliveryEstimate.duration}) with full live courier tracking.
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

                                {/* Breakdown */}
                                <div className="space-y-3 text-sm font-medium text-slate-600">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span>Items Subtotal</span>
                                        <span className="font-bold text-slate-900">
                                            ₹{subtotal.toLocaleString("en-IN")}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                        <span>Estimated Delivery</span>
                                        <span className="font-bold text-purple-700">
                                            {deliveryEstimate.formattedDate}
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
                                            <span className="font-bold">Delivering to:</span>{" "}
                                            {address.fullName || "Customer"}, {address.city} - {address.pincode}
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
                                        <span className="text-xs font-bold text-slate-400">INR</span>
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

            {/* ============================================================ */}
            {/* SELECT DELIVERY ADDRESS DRAWER / MODAL (MATCHING IMAGE 2)     */}
            {/* ============================================================ */}
            {showAddressDrawer && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
                    <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-200">
                        
                        {/* Drawer Header */}
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <h3 className="text-lg font-bold text-slate-900">
                                {isAddingNew ? "Add New Delivery Address" : "Select delivery address"}
                            </h3>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowAddressDrawer(false);
                                    setIsAddingNew(false);
                                }}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-4 flex-1">
                            {isAddingNew ? (
                                /* ADD NEW ADDRESS FORM */
                                <form onSubmit={handleSaveNewAddress} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Receiver's Full Name *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={newAddressForm.fullName}
                                                onChange={handleFormChange}
                                                placeholder="e.g. Khushi Kumari"
                                                className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                    formErrors.fullName ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                                }`}
                                            />
                                        </div>
                                        {formErrors.fullName && (
                                            <p className="text-red-500 text-xs mt-1 font-medium">
                                                {formErrors.fullName}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            10-Digit Mobile Number *
                                        </label>
                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400 text-xs font-bold pointer-events-none">
                                                <Phone className="w-3.5 h-3.5" />
                                                <span>+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                maxLength={10}
                                                value={newAddressForm.phone}
                                                onChange={handleFormChange}
                                                placeholder="9876543210"
                                                className={`w-full bg-slate-50 border rounded-xl py-2.5 pl-14 pr-4 text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                    formErrors.phone ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                                }`}
                                            />
                                        </div>
                                        {formErrors.phone && (
                                            <p className="text-red-500 text-xs mt-1 font-medium">
                                                {formErrors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            Flat, House No., Building, Area, Street *
                                        </label>
                                        <textarea
                                            rows={2}
                                            name="street"
                                            value={newAddressForm.street}
                                            onChange={handleFormChange}
                                            placeholder="e.g. Plot No. 10/A, Mahaveer Colony-B, Bambala"
                                            className={`w-full bg-slate-50 border rounded-xl py-2 pl-3.5 pr-4 text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                formErrors.street ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                            }`}
                                        />
                                        {formErrors.street && (
                                            <p className="text-red-500 text-xs mt-1 font-medium">
                                                {formErrors.street}
                                            </p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                City / District *
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={newAddressForm.city}
                                                onChange={handleFormChange}
                                                placeholder="e.g. Jaipur"
                                                className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                    formErrors.city ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                                }`}
                                            />
                                            {formErrors.city && (
                                                <p className="text-red-500 text-xs mt-1 font-medium">
                                                    {formErrors.city}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                                PIN Code (6 digits) *
                                            </label>
                                            <input
                                                type="text"
                                                maxLength={6}
                                                name="pincode"
                                                value={newAddressForm.pincode}
                                                onChange={handleFormChange}
                                                placeholder="e.g. 302033"
                                                className={`w-full bg-slate-50 border rounded-xl py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-purple-500/20 transition-all ${
                                                    formErrors.pincode ? "border-red-400 ring-2 ring-red-100" : "border-slate-200 focus:border-purple-500"
                                                }`}
                                            />
                                            {formErrors.pincode && (
                                                <p className="text-red-500 text-xs mt-1 font-medium">
                                                    {formErrors.pincode}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5">
                                            State *
                                        </label>
                                        <select
                                            name="state"
                                            value={newAddressForm.state}
                                            onChange={handleFormChange}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3.5 text-sm text-slate-900 focus:outline-none focus:border-purple-500 focus:bg-white transition-all cursor-pointer"
                                        >
                                            {INDIAN_STATES.map((st) => (
                                                <option key={st} value={st}>
                                                    {st}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="pt-3 flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => setIsAddingNew(false)}
                                            className="w-1/3 py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="w-2/3 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md shadow-purple-200 transition-all cursor-pointer"
                                        >
                                            Save & Deliver Here
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                /* SELECT SAVED ADDRESSES VIEW */
                                <>
                                    {/* Search Input Bar */}
                                    <div className="relative">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by name, area, street, pincode"
                                            className="w-full bg-white border border-slate-300 rounded-2xl py-3 pl-10 pr-10 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                                        />
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery("")}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Action 1: Use my current location */}
                                    <button
                                        type="button"
                                        onClick={handleUseCurrentLocation}
                                        disabled={locating}
                                        className="w-full bg-sky-50/70 hover:bg-sky-100/70 border border-sky-100 rounded-2xl p-4 flex items-center justify-between text-left transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xs">
                                                {locating ? (
                                                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                                ) : (
                                                    <Navigation className="w-5 h-5 text-blue-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                                                    Use my current location
                                                </p>
                                                <p className="text-xs text-slate-500 font-medium">
                                                    Allow access to location
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                                    </button>

                                    {/* Action 2: + Add New */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setNewAddressForm({
                                                fullName: user?.name || "",
                                                phone: "",
                                                street: "",
                                                city: "",
                                                state: "Rajasthan",
                                                pincode: "",
                                            });
                                            setIsAddingNew(true);
                                        }}
                                        className="w-full bg-sky-50/70 hover:bg-sky-100/70 border border-sky-100 rounded-2xl p-4 flex items-center justify-between text-left transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3.5">
                                            <div className="w-10 h-10 rounded-xl bg-white text-blue-600 flex items-center justify-center shadow-xs">
                                                <Plus className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-blue-600 group-hover:text-blue-700">
                                                    + Add New
                                                </p>
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-blue-500 group-hover:translate-x-0.5 transition-transform" />
                                    </button>

                                    {/* Saved Addresses Section */}
                                    <div className="pt-2">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                                            Saved addresses
                                        </h4>

                                        {filteredAddresses.length === 0 ? (
                                            <div className="text-center py-6 border border-dashed border-slate-200 rounded-2xl">
                                                <p className="text-xs font-medium text-slate-400">
                                                    {searchQuery
                                                        ? "No addresses match your search."
                                                        : "No saved addresses found. Add a new address above."}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {filteredAddresses.map((addr) => {
                                                    const isSelected =
                                                        address.street &&
                                                        address.street.trim().toLowerCase() ===
                                                            addr.street?.trim().toLowerCase() &&
                                                        address.pincode === addr.pincode;

                                                    return (
                                                        <div
                                                            key={addr.id}
                                                            onClick={() => handleSelectAddress(addr)}
                                                            className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex items-start gap-3.5 ${
                                                                isSelected
                                                                    ? "border-blue-400 bg-blue-50/40 ring-1 ring-blue-300 shadow-sm"
                                                                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                                                            }`}
                                                        >
                                                            {/* Home Icon */}
                                                            <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                                                <Home className="w-5 h-5 text-blue-600" />
                                                            </div>

                                                            {/* Content */}
                                                            <div className="flex-1 min-w-0 pr-8">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <span className="font-bold text-slate-900 text-sm">
                                                                        {addr.fullName}
                                                                    </span>
                                                                    {isSelected && (
                                                                        <span className="bg-sky-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                                                            Selected
                                                                        </span>
                                                                    )}
                                                                </div>

                                                                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                                                    {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                                                                </p>

                                                                <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                                    <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                                                    <span>{addr.phone}</span>
                                                                </div>
                                                            </div>

                                                            {/* Delete button */}
                                                            <button
                                                                type="button"
                                                                title="Delete address"
                                                                onClick={(e) => handleDeleteSavedAddress(e, addr.id)}
                                                                className="absolute right-3.5 top-4 text-slate-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Checkout;
