import React, { useState } from 'react';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Search, 
  ShieldCheck, 
  Calendar, 
  AlertCircle,
  Phone
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function TrackOrder() {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  // Sample mock tracking dataset
  const sampleTrackingData = {
    'BAZ-8891': {
      orderId: 'BAZ-8891',
      courier: 'BlueDart Express',
      awb: 'BD-904128472',
      status: 'Delivered',
      currentStep: 4,
      estimatedDelivery: 'Delivered on September 08, 2026',
      destination: 'Bandra West, Mumbai, MH - 400050',
      timeline: [
        { time: 'Sep 08, 04:30 PM', title: 'Package Delivered', desc: 'Handed over directly to resident with OTP confirmation', location: 'Mumbai' },
        { time: 'Sep 08, 09:15 AM', title: 'Out for Delivery', desc: 'Courier agent Rohit (Ph: +91 9876543210) assigned for delivery', location: 'Mumbai Hub' },
        { time: 'Sep 07, 07:45 PM', title: 'Arrived at Destination Facility', desc: 'Sorted and verified at Mumbai sorting warehouse', location: 'Mumbai Central Hub' },
        { time: 'Sep 06, 02:10 PM', title: 'Order Dispatched', desc: 'Handed over to BlueDart courier from Bazario Mega Hub', location: 'Bangalore Logistics Park' },
        { time: 'Sep 05, 11:00 AM', title: 'Order Confirmed', desc: 'Payment verified and inventory allocated', location: 'Bazario HQ' }
      ]
    },
    'BAZ-9942': {
      orderId: 'BAZ-9942',
      courier: 'Delhivery Surface',
      awb: 'DLV-441892019',
      status: 'In Transit',
      currentStep: 3,
      estimatedDelivery: 'Expected by Sep 12, 2026',
      destination: 'Indiranagar, Bengaluru, KA - 560038',
      timeline: [
        { time: 'Sep 10, 08:20 AM', title: 'In Transit to Destination Hub', desc: 'Vehicle departed linehaul transit terminal', location: 'Pune Transit Hub' },
        { time: 'Sep 09, 06:15 PM', title: 'Order Dispatched', desc: 'Courier partner received parcel from merchant', location: 'Pune Warehouse' },
        { time: 'Sep 09, 11:30 AM', title: 'Packed & Ready', desc: 'Quality checked and securely packaged', location: 'Pune Merchant Hub' },
        { time: 'Sep 08, 09:40 PM', title: 'Order Confirmed', desc: 'Order received and confirmed', location: 'Bazario Online' }
      ]
    }
  };

  const handleSearch = (e, explicitCode) => {
    if (e) e.preventDefault();
    const query = (explicitCode || trackingNumber).trim().toUpperCase();

    if (!query) {
      toast.error('Please enter an Order ID or AWB Tracking Number');
      return;
    }

    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      // Check if match or fallback to a generated result
      const found = sampleTrackingData[query] || {
        orderId: query,
        courier: 'Express Logistics Network',
        awb: `TRK-${Math.floor(10000000 + Math.random() * 90000000)}`,
        status: 'In Transit',
        currentStep: 2,
        estimatedDelivery: 'Expected within 3-4 business days',
        destination: 'Customer Delivery Address on File',
        timeline: [
          { time: 'Today, Just Now', title: 'Shipment Processing', desc: 'Package scanned at regional fulfillment center', location: 'Distribution Hub' },
          { time: 'Yesterday', title: 'Order Packed', desc: 'Seller packaged your items with eco-friendly protective materials', location: 'Seller Facility' },
          { time: '2 days ago', title: 'Order Placed & Verified', desc: 'Payment received successfully via Bazario checkout', location: 'Bazario Network' }
        ]
      };

      setTrackingResult(found);
      toast.success(`Tracking details loaded for ${found.orderId}`);
    }, 600);
  };

  const stepsList = [
    { num: 1, label: 'Order Placed' },
    { num: 2, label: 'Packed' },
    { num: 3, label: 'In Transit' },
    { num: 4, label: 'Delivered' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-4">
            <Truck className="w-4 h-4" />
            Live Shipment Tracker
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Track Your Order
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            Stay updated with real-time delivery milestones from dispatch to your doorstep.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Enter Order ID (e.g. BAZ-8891 or BAZ-9942)"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="py-3.5 px-8 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-2xl shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
            >
              {isSearching ? 'Searching...' : 'Track Package'}
            </button>
          </form>

          {/* Quick Demo Pre-fills */}
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span className="font-medium">Try demo order numbers:</span>
            <button
              type="button"
              onClick={() => {
                setTrackingNumber('BAZ-8891');
                handleSearch(null, 'BAZ-8891');
              }}
              className="px-2.5 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 font-semibold rounded-lg transition"
            >
              BAZ-8891 (Delivered)
            </button>
            <button
              type="button"
              onClick={() => {
                setTrackingNumber('BAZ-9942');
                handleSearch(null, 'BAZ-9942');
              }}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold rounded-lg transition"
            >
              BAZ-9942 (In Transit)
            </button>
          </div>
        </div>

        {/* Tracking Details View */}
        {trackingResult && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 animate-fadeIn">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Order #{trackingResult.orderId}</h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    trackingResult.status === 'Delivered' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {trackingResult.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Courier: <strong className="text-slate-700">{trackingResult.courier}</strong> (AWB: {trackingResult.awb})
                </p>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Delivery</div>
                <div className="text-sm font-bold text-purple-600">{trackingResult.estimatedDelivery}</div>
              </div>
            </div>

            {/* Stepper Bar */}
            <div className="py-8">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute left-6 right-6 top-5 h-1 bg-slate-200 -z-0">
                  <div
                    className="h-full bg-purple-600 transition-all duration-500"
                    style={{
                      width: `${((trackingResult.currentStep - 1) / (stepsList.length - 1)) * 100}%`
                    }}
                  />
                </div>

                {stepsList.map((step) => {
                  const isDone = step.num <= trackingResult.currentStep;
                  const isCurrent = step.num === trackingResult.currentStep;
                  return (
                    <div key={step.num} className="flex flex-col items-center relative z-10">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                          isDone
                            ? 'bg-purple-600 text-white shadow-md ring-4 ring-purple-100'
                            : 'bg-white border-2 border-slate-300 text-slate-400'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : step.num}
                      </div>
                      <span className={`text-[11px] sm:text-xs font-semibold mt-2 text-center ${
                        isCurrent ? 'text-purple-700 font-bold' : isDone ? 'text-slate-800' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Destination Info */}
            <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-3 mb-8">
              <MapPin className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <span className="text-xs text-slate-500 block">Shipping Destination</span>
                <span className="text-xs sm:text-sm font-semibold text-slate-800">{trackingResult.destination}</span>
              </div>
            </div>

            {/* Detailed Activity Logs */}
            <h3 className="text-base font-bold text-slate-900 mb-4">Milestone Activity Log</h3>
            <div className="relative pl-6 border-l-2 border-purple-200 space-y-6">
              {trackingResult.timeline.map((event, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-[31px] top-1 w-3.5 h-3.5 rounded-full bg-purple-600 border-2 border-white ring-2 ring-purple-200" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-purple-600">{event.time}</span>
                    <span className="text-[11px] text-slate-400 font-medium">{event.location}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">{event.title}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{event.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Help */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Experiencing delivery delays or tracking discrepancies?{' '}
          <a href="/contact" className="text-purple-600 font-semibold hover:underline">
            Contact Delivery Escalation Support
          </a>
        </div>
      </div>
    </div>
  );
}
