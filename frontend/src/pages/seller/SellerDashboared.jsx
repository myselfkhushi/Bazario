import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
    Inbox,
    Printer,
    Truck,
    Send,
    CheckCircle2,
    Package,
    Calendar,
    MapPin,
    User,
    RefreshCw,
    X,
    Check,
    Store,
    Layers,
    AlertCircle,
    Eye,
    Archive
} from "lucide-react";

import { getSellerOrders } from "../../features/seller/sellerSlice";
import { updateSellerOrderStatus } from "../../features/seller/sellerAPI";
import ShippingLabelModal from "../../component/seller/ShippingLabelModal.jsx";

export default function SellerDashboared() {
    const dispatch = useDispatch();
    const { orders = [], loading } = useSelector((state) => state.seller);

    // Active Tab State (Default: 'new' orders)
    const [activeTab, setActiveTab] = useState("new");

    // In-flight tracking: Prevents double-click / rapid clicking concurrency
    const [inFlightOrders, setInFlightOrders] = useState(new Set());

    // Local state for instant (0ms) optimistic transitions
    const [localOrders, setLocalOrders] = useState([]);

    // Keep localOrders synced with Redux orders while preserving optimistic updates
    useEffect(() => {
        setLocalOrders(orders);
    }, [orders]);

    // 🛑 DEDUPLICATION GUARANTEE: Ensure every order ID appears strictly ONCE
    const uniqueOrders = useMemo(() => {
        const sourceList = localOrders.length > 0 ? localOrders : orders;
        const map = new Map();
        for (const order of sourceList) {
            if (order && order._id) {
                map.set(order._id, order);
            }
        }
        return Array.from(map.values());
    }, [localOrders, orders]);

    // Track which orders have had their labels printed
    const [printedOrderIds, setPrintedOrderIds] = useState(() => {
        try {
            const saved = localStorage.getItem("seller_printed_orders");
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch {
            return new Set();
        }
    });

    const markLabelAsPrinted = (orderId) => {
        setPrintedOrderIds((prev) => {
            const next = new Set(prev);
            next.add(orderId);
            try {
                localStorage.setItem("seller_printed_orders", JSON.stringify([...next]));
            } catch {
                // Ignore storage error
            }
            return next;
        });
    };

    // Modals
    const [selectedLabelModal, setSelectedLabelModal] = useState(null); // { order, canPrint: boolean, autoPrint: boolean }
    const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
    const [courierName, setCourierName] = useState("Delhivery Surface");
    const [awbNumber, setAwbNumber] = useState("");

    useEffect(() => {
        dispatch(getSellerOrders());
    }, [dispatch]);

    // Helper: Checks if order is Shipped or Delivered
    const isShippedOrDelivered = (st) => ["shipped", "out_for_delivery", "delivered"].includes(st?.toLowerCase());

    // Live counts for all pipeline stages
    const counts = {
        new: uniqueOrders.filter((o) => ["pending", "confirmed"].includes(o.orderstatus?.toLowerCase())).length,
        print_label: uniqueOrders.filter((o) => o.orderstatus?.toLowerCase() === "processing").length,
        handover: uniqueOrders.filter((o) => o.orderstatus?.toLowerCase() === "rtd").length,
        in_transit: uniqueOrders.filter((o) => ["shipped", "out_for_delivery"].includes(o.orderstatus?.toLowerCase())).length,
        delivered: uniqueOrders.filter((o) => o.orderstatus?.toLowerCase() === "delivered").length,
        // 🛑 RULE: 'All Orders' only counts shipped or delivered orders!
        all: uniqueOrders.filter((o) => isShippedOrDelivered(o.orderstatus)).length,
    };

    // Filter orders according to selected tab
    const filteredOrders = uniqueOrders.filter((o) => {
        const st = o.orderstatus?.toLowerCase();
        if (activeTab === "new") return ["pending", "confirmed"].includes(st);
        if (activeTab === "print_label") return st === "processing";
        if (activeTab === "handover") return st === "rtd";
        if (activeTab === "in_transit") return ["shipped", "out_for_delivery"].includes(st);
        if (activeTab === "delivered") return st === "delivered";
        // 🛑 RULE: In 'All Orders' tab, show ONLY shipped or delivered orders!
        if (activeTab === "all") return isShippedOrDelivered(st);
        return true;
    });

    // ⚡ CONCURRENCY & OPTIMISTIC STATUS UPDATE
    const handleQuickStatus = async (orderId, newStatus, successMsg) => {
        // 1. Guard against double-tap / rapid clicks
        if (inFlightOrders.has(orderId)) return;

        // 2. Lock this orderId immediately
        setInFlightOrders((prev) => new Set(prev).add(orderId));

        // 3. 0ms Optimistic UI Update: Instantly change status so order disappears from current tab immediately!
        setLocalOrders((prev) => {
            const current = prev.length > 0 ? prev : orders;
            return current.map((o) =>
                o._id === orderId ? { ...o, orderstatus: newStatus } : o
            );
        });

        // 4. Send API request to backend
        try {
            await updateSellerOrderStatus(orderId, { orderstatus: newStatus });
            toast.success(successMsg || `Order moved to ${newStatus.toUpperCase()}`);
            dispatch(getSellerOrders());
        } catch (err) {
            // Revert on error
            setLocalOrders(orders);
            toast.error(err.response?.data?.message || "Failed to update status");
        } finally {
            // Unlock orderId
            setInFlightOrders((prev) => {
                const next = new Set(prev);
                next.delete(orderId);
                return next;
            });
        }
    };

    // Direct Print Action: Automatically triggers print & save workflow
    const handleDirectPrint = (order) => {
        // 🛑 CRITICAL: Do NOT mark as printed here!
        // The order is marked as printed ONLY after the label is saved to device and printed.
        setSelectedLabelModal({ order, canPrint: true, autoPrint: true });
    };

    // Callback invoked strictly when label is saved to device and printed
    const handlePrintSuccess = (orderId) => {
        markLabelAsPrinted(orderId);
        toast.success("Shipping label saved & printed! You can now mark order as packed.");
    };

    // Handover to Courier Submit
    const handleDispatchSubmit = async (e) => {
        e.preventDefault();
        if (!dispatchModalOrder) return;
        const orderId = dispatchModalOrder._id;

        if (inFlightOrders.has(orderId)) return;

        const tracking = awbNumber.trim() || `TRK-${orderId.slice(-8).toUpperCase()}`;

        setInFlightOrders((prev) => new Set(prev).add(orderId));

        // Optimistic update to 'shipped'
        setLocalOrders((prev) =>
            prev.map((o) =>
                o._id === orderId
                    ? { ...o, orderstatus: "shipped", courier: courierName, trackingNumber: tracking }
                    : o
            )
        );

        try {
            await updateSellerOrderStatus(orderId, {
                orderstatus: "shipped",
                courier: courierName,
                trackingNumber: tracking,
            });
            toast.success("Parcel successfully handed over to courier!");
            setDispatchModalOrder(null);
            setAwbNumber("");
            dispatch(getSellerOrders());
        } catch (err) {
            setLocalOrders(orders);
            toast.error(err.response?.data?.message || "Failed to dispatch order");
        } finally {
            setInFlightOrders((prev) => {
                const next = new Set(prev);
                next.delete(orderId);
                return next;
            });
        }
    };

    // 🛡️ Robust Historical Image Extractor (Works even if product is deleted/unlisted)
    const resolveItemImage = (item) => {
        if (!item) return "/placeholder.png";
        if (typeof item.image === "string" && item.image) return item.image;
        if (item.image?.url) return item.image.url;
        if (item.product?.images?.[0]) {
            const pImg = item.product.images[0];
            return typeof pImg === "string" ? pImg : pImg.url || "/placeholder.png";
        }
        return "/placeholder.png";
    };

    const tabs = [
        {
            id: "new",
            label: "New Orders",
            count: counts.new,
            icon: Inbox,
            badgeBg: counts.new > 0 ? "bg-amber-500 text-white" : "bg-slate-200 text-slate-600",
            activeColor: "border-amber-500 text-amber-600 bg-amber-50/50",
            desc: "New incoming customer orders awaiting confirmation"
        },
        {
            id: "print_label",
            label: "Print Labels",
            count: counts.print_label,
            icon: Printer,
            badgeBg: counts.print_label > 0 ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-600",
            activeColor: "border-indigo-600 text-indigo-600 bg-indigo-50/50",
            desc: "Orders packed and awaiting Shipping Label & Tax Invoice printing"
        },
        {
            id: "handover",
            label: "Handover to Courier",
            count: counts.handover,
            icon: Truck,
            badgeBg: counts.handover > 0 ? "bg-purple-600 text-white" : "bg-slate-200 text-slate-600",
            activeColor: "border-purple-600 text-purple-600 bg-purple-50/50",
            desc: "Ready to Dispatch (RTD) parcels awaiting courier partner pickup"
        },
        {
            id: "in_transit",
            label: "In Transit",
            count: counts.in_transit,
            icon: Send,
            badgeBg: "bg-blue-600 text-white",
            activeColor: "border-blue-600 text-blue-600 bg-blue-50/50",
            desc: "Dispatched parcels currently on the way with logistics"
        },
        {
            id: "delivered",
            label: "Delivered",
            count: counts.delivered,
            icon: CheckCircle2,
            badgeBg: "bg-emerald-600 text-white",
            activeColor: "border-emerald-600 text-emerald-600 bg-emerald-50/50",
            desc: "Successfully delivered to customer"
        },
        {
            id: "all",
            label: "All Orders",
            count: counts.all,
            icon: Layers,
            badgeBg: "bg-slate-800 text-white",
            activeColor: "border-slate-800 text-slate-900 bg-slate-50",
            desc: "Shipped & Delivered orders history"
        },
    ];

    const currentTabInfo = tabs.find((t) => t.id === activeTab) || tabs[0];

    return (
        <div className="font-sans text-slate-900 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
                        <Store className="w-7 h-7 text-indigo-600" />
                        Seller Hub
                    </h1>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1 font-medium">
                        Manage your end-to-end packing, label printing, and courier handovers in real time.
                    </p>
                </div>

                <button
                    onClick={() => dispatch(getSellerOrders())}
                    className="inline-flex items-center gap-2 self-start px-4 py-2.5 bg-white border border-slate-200 hover:border-slate-300 rounded-2xl text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-indigo-600" : ""}`} />
                    Refresh Pipeline
                </button>
            </div>

            {/* Fulfillment Pipeline Tabs */}
            <div className="bg-white rounded-3xl p-2 border border-slate-200/80 shadow-xs mb-8 overflow-x-auto">
                <div className="flex items-center gap-2 min-w-max">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl font-bold text-xs transition cursor-pointer border ${
                                    isActive
                                        ? `${tab.activeColor} shadow-xs`
                                        : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? "" : "text-slate-400"}`} />
                                <span>{tab.label}</span>
                                <span
                                    className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-black tracking-wider ${
                                        isActive ? tab.badgeBg : "bg-slate-100 text-slate-700"
                                    }`}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Section Description Bar */}
            <div className="flex items-center justify-between mb-4 px-2">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">
                        {currentTabInfo.label} ({filteredOrders.length})
                    </h2>
                    <span className="text-xs text-slate-400 font-medium hidden sm:inline">— {currentTabInfo.desc}</span>
                </div>
            </div>

            {/* Orders Feed */}
            {filteredOrders.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200/80 p-16 text-center shadow-xs">
                    <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
                        <Package className="w-8 h-8" />
                    </div>
                    <h3 className="text-base font-black text-slate-800">No Orders in this Section</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto font-medium">
                        There are currently no orders in <span className="font-bold text-slate-600">{currentTabInfo.label}</span>. 
                        Orders matching this stage will show up here automatically.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map((order) => {
                        const isOrderInFlight = inFlightOrders.has(order._id);
                        const st = order.orderstatus?.toLowerCase();
                        const isLabelPrinted = printedOrderIds.has(order._id);

                        return (
                            <div
                                key={order._id}
                                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-shadow"
                            >
                                {/* Top Bar: Order ID, Date, Amount & Status */}
                                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-center text-slate-600 font-black text-xs">
                                            #{order._id.slice(-4).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                                                    Order #{order._id.slice(-10).toUpperCase()}
                                                </h3>
                                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                                                    st === "delivered"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : st === "shipped" || st === "out_for_delivery"
                                                        ? "bg-blue-50 text-blue-700 border-blue-200"
                                                        : st === "rtd"
                                                        ? "bg-purple-50 text-purple-700 border-purple-200"
                                                        : st === "processing"
                                                        ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                }`}>
                                                    {order.orderstatus}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                        day: "numeric",
                                                        month: "short",
                                                        year: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                                <span>•</span>
                                                <span className="flex items-center gap-1 font-semibold text-slate-600">
                                                    <User className="w-3 h-3 text-slate-400" />
                                                    {order.user?.name || "Customer"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Total Payable */}
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Order Value</p>
                                        <p className="text-lg font-black text-slate-900">
                                            ₹{order.totalamount?.toLocaleString("en-IN")}
                                        </p>
                                    </div>
                                </div>

                                {/* Center: Product Items & Delivery Address (Historical Snapshotted Data) */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-4">
                                    {/* Products Column */}
                                    <div className="lg:col-span-2 space-y-3">
                                        {order.orderitem?.map((item, idx) => {
                                            const itemImg = resolveItemImage(item);
                                            const itemTitle = item.title || item.product?.title || "Purchased Product Item";
                                            const itemPrice = item.price || 0;
                                            const itemQty = item.quantity || 1;
                                            const isUnlisted = !item.product || item.product.isListed === false || item.product.isDeleted;

                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50/70 border border-slate-100"
                                                >
                                                    <img
                                                        src={itemImg}
                                                        alt={itemTitle}
                                                        className="w-14 h-14 rounded-xl object-cover bg-white border border-slate-200/60 shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <p className="text-xs font-bold text-slate-900 truncate">
                                                                {itemTitle}
                                                            </p>
                                                            {isUnlisted && (
                                                                <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-200 text-slate-600 flex items-center gap-1">
                                                                    <Archive className="w-2.5 h-2.5" />
                                                                    Archived Listing
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                                                            Qty: <span className="font-bold text-slate-800">{itemQty}</span> • Rate: <span className="font-bold text-slate-800">₹{itemPrice.toLocaleString("en-IN")}</span>
                                                        </p>
                                                    </div>
                                                    <div className="text-right font-black text-xs text-slate-900 pr-2">
                                                        ₹{(itemPrice * itemQty).toLocaleString("en-IN")}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Delivery Address Column (Full Permanent Record) */}
                                    <div className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col justify-between text-xs">
                                        <div>
                                            <p className="font-bold text-slate-700 flex items-center gap-1.5 mb-1.5">
                                                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                                                Shipping Address
                                            </p>
                                            <p className="text-slate-800 font-bold">
                                                {order.shippingAddress?.fullName || order.user?.name || "Recipient"}
                                            </p>
                                            <p className="text-slate-500 mt-0.5 leading-relaxed">
                                                {order.shippingAddress?.street || "Address not provided"}, {order.shippingAddress?.city || ""}, {order.shippingAddress?.state || ""} - {order.shippingAddress?.pincode || ""}
                                            </p>
                                            {order.shippingAddress?.phone && (
                                                <p className="text-slate-600 mt-1.5 font-bold">
                                                    Ph: +91 {order.shippingAddress?.phone}
                                                </p>
                                            )}
                                        </div>

                                        {order.trackingNumber && (
                                            <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Courier / AWB</p>
                                                <p className="font-black text-xs text-slate-900 truncate">
                                                    {order.courier || "Logistics"}: {order.trackingNumber}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Bottom Action Buttons */}
                                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                                    {/* Left: Status Badge or View-Only Button */}
                                    <div>
                                        {st === "processing" ? (
                                            isLabelPrinted ? (
                                                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                                    Shipping Label Printed & Saved
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                                                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                                                    Label Print & Save Required
                                                </span>
                                            )
                                        ) : (
                                            /* 🛑 In other sections: View-only label & invoice */
                                            st !== "pending" && st !== "confirmed" && (
                                                <button
                                                    onClick={() => setSelectedLabelModal({ order, canPrint: false, autoPrint: false })}
                                                    className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition flex items-center gap-1.5 cursor-pointer"
                                                >
                                                    <Eye className="w-3.5 h-3.5 text-slate-500" />
                                                    View Label & Invoice
                                                </button>
                                            )
                                        )}
                                    </div>

                                    {/* Right Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        {/* ── STAGE 1: NEW ORDERS ────────────────────────── */}
                                        {["pending", "confirmed"].includes(st) && (
                                            <button
                                                disabled={isOrderInFlight}
                                                onClick={() =>
                                                    handleQuickStatus(
                                                        order._id,
                                                        "processing",
                                                        "Order accepted! Moved to Print Labels."
                                                    )
                                                }
                                                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                <Check className="w-4 h-4" />
                                                {isOrderInFlight ? "Processing..." : "Accept & Move to Pack"}
                                            </button>
                                        )}

                                        {/* ── STAGE 2: PRINT LABELS TAB ─────────────────── */}
                                        {st === "processing" && (
                                            <>
                                                {/* STEP 1: Before Print -> Pressing triggers print & device save */}
                                                {!isLabelPrinted ? (
                                                    <button
                                                        onClick={() => handleDirectPrint(order)}
                                                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition flex items-center gap-2 cursor-pointer"
                                                    >
                                                        <Printer className="w-4 h-4" />
                                                        Print & Save Shipping Label
                                                    </button>
                                                ) : (
                                                    /* STEP 2: After Print -> ONLY 'Mark Packed & Ready for Pickup' */
                                                    <button
                                                        disabled={isOrderInFlight}
                                                        onClick={() =>
                                                            handleQuickStatus(
                                                                order._id,
                                                                "rtd",
                                                                "Packed! Order moved to Handover to Courier."
                                                            )
                                                        }
                                                        className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50 animate-[fadeIn_0.2s_ease-out]"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4" />
                                                        {isOrderInFlight ? "Moving..." : "Product Packed & Ready for Pickup"}
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {/* ── STAGE 3: HANDOVER TO COURIER (RTD) ────────── */}
                                        {st === "rtd" && (
                                            <button
                                                disabled={isOrderInFlight}
                                                onClick={() => {
                                                    setDispatchModalOrder(order);
                                                    setAwbNumber(`TRK-${order._id.slice(-8).toUpperCase()}`);
                                                }}
                                                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
                                            >
                                                <Truck className="w-4 h-4" />
                                                Handover to Courier Partner
                                            </button>
                                        )}

                                        {/* ── STAGE 4: IN TRANSIT ────────────────────────── */}
                                        {(st === "shipped" || st === "out_for_delivery") && (
                                            <div className="flex items-center gap-2 text-xs font-bold text-blue-700 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200">
                                                <Send className="w-3.5 h-3.5" />
                                                In Transit ({order.courier || "Courier"})
                                            </div>
                                        )}

                                        {/* ── STAGE 5: DELIVERED ─────────────────────────── */}
                                        {st === "delivered" && (
                                            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Delivered to Customer
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Shipping Label Modal */}
            {selectedLabelModal && (
                <ShippingLabelModal
                    order={selectedLabelModal.order}
                    canPrint={selectedLabelModal.canPrint}
                    autoPrint={selectedLabelModal.autoPrint}
                    onPrintSuccess={handlePrintSuccess}
                    onClose={() => setSelectedLabelModal(null)}
                />
            )}

            {/* Handover to Courier Modal */}
            {dispatchModalOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-purple-600" />
                                Courier Handover Manifest
                            </h3>
                            <button
                                onClick={() => setDispatchModalOrder(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 cursor-pointer"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form onSubmit={handleDispatchSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Courier Logistics Partner
                                </label>
                                <select
                                    value={courierName}
                                    onChange={(e) => setCourierName(e.target.value)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-600"
                                >
                                    <option value="Delhivery Surface">Delhivery Surface</option>
                                    <option value="BlueDart Express">BlueDart Express</option>
                                    <option value="Ecom Express">Ecom Express</option>
                                    <option value="Shadowfax Logistics">Shadowfax Logistics</option>
                                    <option value="DTDC Surface">DTDC Surface</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                                    Tracking / AWB Number
                                </label>
                                <input
                                    type="text"
                                    value={awbNumber}
                                    onChange={(e) => setAwbNumber(e.target.value)}
                                    placeholder="Enter or generate AWB"
                                    required
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 focus:outline-hidden focus:border-purple-600 font-mono"
                                />
                                <p className="text-[11px] text-slate-400 mt-1">
                                    This tracking number will be provided to the customer to track their parcel.
                                </p>
                            </div>

                            <div className="pt-2 flex items-center justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setDispatchModalOrder(null)}
                                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={inFlightOrders.has(dispatchModalOrder._id)}
                                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-xs cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    Confirm Handover
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
