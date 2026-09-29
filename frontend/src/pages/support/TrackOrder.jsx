import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  AlertCircle,
  ArrowLeft,
  Store,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import { trackOrderAPI } from '../../features/order/orderAPI';

export default function TrackOrder() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(searchParams.get('id') || searchParams.get('orderId') || '');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Auto-search on page load if ?id= is present in URL
  useEffect(() => {
    const queryId = searchParams.get('id') || searchParams.get('orderId');
    if (queryId) {
      setTrackingNumber(queryId);
      performTrack(queryId);
    }
  }, [searchParams]);

  const performTrack = async (queryCode) => {
    const code = (queryCode || trackingNumber).trim();
    if (!code) {
      toast.error('Please enter an Order ID or AWB Tracking Number');
      return;
    }

    try {
      setIsSearching(true);
      const res = await trackOrderAPI(code);
      if (res.success && res.order) {
        setTrackingResult(res.order);
        toast.success('Live shipment status loaded!');
      } else {
        toast.error('Order not found');
        setTrackingResult(null);
      }
    } catch (err) {
      console.error('Tracking fetch error:', err);
      toast.error(err.response?.data?.message || 'No shipment found for this ID/Tracking Number');
      setTrackingResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (trackingNumber.trim()) {
      setSearchParams({ id: trackingNumber.trim() });
      performTrack(trackingNumber.trim());
    }
  };

  // 5 Real-World Logistics Steps
  const stepsList = [
    { num: 1, key: 'pending', label: 'Order Placed' },
    { num: 2, key: 'confirmed', label: 'Confirmed & Packed' },
    { num: 3, key: 'shipped', label: 'Dispatched' },
    { num: 4, key: 'out_for_delivery', label: 'Out for Delivery' },
    { num: 5, key: 'delivered', label: 'Delivered' }
  ];

  const getStepNumber = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 1;
      case 'confirmed':
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'out_for_delivery': return 4;
      case 'delivered': return 5;
      case 'cancelled': return -1;
      default: return 1;
    }
  };

  const currentStep = getStepNumber(trackingResult?.orderstatus);
  const isCancelled = trackingResult?.orderstatus === 'cancelled';

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto">
        
        {/* Back link */}
        <div className="mb-6">
          <Link to="/orders" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-purple-600 transition">
            <ArrowLeft className="w-4 h-4" /> Back to My Orders
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold mb-3 shadow-xs">
            <Truck className="w-4 h-4" />
            Live Shipment Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Track Your Order
          </h1>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto font-medium">
            Real-time delivery milestones from seller dispatch to your doorstep.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Order ID or AWB Tracking Number..."
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="py-3.5 px-8 bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-purple-200 transition disabled:opacity-50 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              {isSearching ? 'Searching...' : 'Track Package'}
            </button>
          </form>
        </div>

        {/* Tracking Details View */}
        {trackingResult && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-8 animate-in fade-in duration-300">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-900">
                    Order #{trackingResult._id.slice(-8).toUpperCase()}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    isCancelled 
                      ? 'bg-rose-100 text-rose-700 border border-rose-200' 
                      : trackingResult.orderstatus === 'delivered' 
                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                      : 'bg-purple-100 text-purple-700 border border-purple-200'
                  }`}>
                    {trackingResult.orderstatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Logistics Partner: <strong className="text-slate-800">{trackingResult.courier || "Surface Logistics"}</strong> • AWB: <strong className="font-mono text-slate-800">{trackingResult.trackingNumber || "Assigned on Dispatch"}</strong>
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order Placed On</div>
                <div className="text-xs font-bold text-slate-700 mt-0.5">
                  {new Date(trackingResult.createdAt).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            {/* Stepper Bar (Only if not cancelled) */}
            {isCancelled ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-2">
                <ShieldAlert className="w-10 h-10 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-rose-900">This Order Has Been Cancelled</h3>
                <p className="text-xs text-rose-600 max-w-md mx-auto">
                  If payment was deducted, your refund will be processed back to your original payment method.
                </p>
              </div>
            ) : (
              <div className="py-6">
                <div className="flex items-center justify-between relative">
                  {/* Connecting Line */}
                  <div className="absolute left-6 right-6 top-5 h-1 bg-slate-100 -z-0">
                    <div
                      className="h-full bg-purple-600 transition-all duration-700 ease-out"
                      style={{
                        width: `${Math.max(0, ((currentStep - 1) / (stepsList.length - 1)) * 100)}%`
                      }}
                    />
                  </div>

                  {stepsList.map((step) => {
                    const isDone = step.num <= currentStep;
                    const isCurrent = step.num === currentStep;
                    return (
                      <div key={step.num} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                            isDone
                              ? 'bg-purple-600 text-white shadow-md shadow-purple-200 ring-4 ring-purple-50'
                              : 'bg-white border-2 border-slate-200 text-slate-400'
                          }`}
                        >
                          {isDone ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                        </div>
                        <span className={`text-[10px] sm:text-xs font-bold mt-2 text-center max-w-[80px] sm:max-w-none ${
                          isCurrent ? 'text-purple-700' : isDone ? 'text-slate-800' : 'text-slate-400'
                        }`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Destination Info */}
            {trackingResult.shippingAddress && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-start gap-3">
                <MapPin className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest block text-[10px]">Delivery Destination</span>
                  <p className="font-bold text-slate-900 mt-0.5">{trackingResult.shippingAddress.fullName} (📞 {trackingResult.shippingAddress.phone})</p>
                  <p className="text-slate-600">{trackingResult.shippingAddress.street}, {trackingResult.shippingAddress.city}, {trackingResult.shippingAddress.state} - {trackingResult.shippingAddress.pincode}</p>
                </div>
              </div>
            )}

            {/* Milestone Activity Log */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Milestone Activity Log</h3>
              <div className="relative pl-6 border-l-2 border-purple-200 space-y-6">
                {trackingResult.statusHistory && trackingResult.statusHistory.length > 0 ? (
                  trackingResult.statusHistory.slice().reverse().map((event, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white ring-2 ring-purple-100" />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <span className="text-xs font-bold text-purple-700 capitalize">{event.status.replace("_", " ")}</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {new Date(event.timestamp).toLocaleDateString("en-IN", { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          {event.location ? ` • ${event.location}` : ''}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-700 mt-1">{event.message}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic">No milestone events logged yet.</p>
                )}
              </div>
            </div>

            {/* Items in parcel */}
            {trackingResult.orderitem && trackingResult.orderitem.length > 0 && (
              <div className="pt-6 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Items in this Package</h3>
                <div className="divide-y divide-slate-100">
                  {trackingResult.orderitem.map((item, i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.image || "https://placehold.co/50"} 
                          alt={item.title} 
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200" 
                        />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.title}</p>
                          <p className="text-slate-500 font-medium">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}