import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  RotateCcw, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertTriangle, 
  ArrowRight,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Returns() {
  const [orderId, setOrderId] = useState('');
  const [returnReason, setReturnReason] = useState('damaged');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleReturnLookup = (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      toast.error('Please enter a valid Order ID');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Return request initiated for Order #${orderId.toUpperCase()}. Pickup scheduled in 48 hours!`, {
        duration: 5000,
        icon: '📦'
      });
      setOrderId('');
    }, 1200);
  };

  const steps = [
    {
      step: '01',
      title: 'Submit Return Request',
      desc: 'Go to your Orders, select the product and reason for return or replacement within 7 days of delivery.',
      icon: Package,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      step: '02',
      title: 'Doorstep Pickup',
      desc: 'Our logistics associate will inspect the item tags and packaging and pick it up safely from your doorstep.',
      icon: Truck,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      step: '03',
      title: 'Quality Verification',
      desc: 'Once the returned package reaches our regional fulfillment hub, automated QC checks are completed within 24h.',
      icon: Clock,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      step: '04',
      title: 'Instant Refund / Replacement',
      desc: 'Refund is initiated directly to your bank/UPI or replacement unit is dispatched at zero additional charge.',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-4">
            <RotateCcw className="w-4 h-4" />
            7-Day Zero Questions Return Guarantee
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Easy & Hassle-Free Returns
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Not completely happy with your purchase? We make returns and replacements seamless with doorstep pickups and instant refunds.
          </p>
        </div>

        {/* 4 Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
                <span className="text-3xl font-black text-slate-200 absolute top-4 right-4">
                  {item.step}
                </span>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Return Request Form */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Initiate an Instant Return or Replacement</h2>
            <p className="text-sm text-slate-500 mb-8">
              Enter your Order ID below to schedule a pickup without logging in, or check your order history.
            </p>

            <form onSubmit={handleReturnLookup} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Order ID or Tracking Number
                </label>
                <input
                  type="text"
                  placeholder="e.g. BAZ-7821-449"
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Reason for Return
                </label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="damaged">Damaged or defective item received</option>
                  <option value="size">Size / Fit doesn't match expectations</option>
                  <option value="wrong">Received different product / color</option>
                  <option value="quality">Quality not as expected</option>
                  <option value="other">Changed my mind / no longer needed</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Checking Order Status...
                  </>
                ) : (
                  <>
                    Request Return / Exchange
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Eligible vs Non-Eligible Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-200">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">Eligible for Full Return & Refund</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Electronics with all original accessories, cable, manuals and box</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Clothing, shoes, and apparel with security tags uncut</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Home decor, kitchen appliances, and unopened books</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span>Any product that arrived physically damaged or dead-on-arrival</span>
              </li>
            </ul>
          </div>

          <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-200">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <h3 className="text-base font-bold text-slate-900">Non-Returnable Items (Hygiene/Safety)</h3>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Cosmetics, perfumes, and skincare products once factory seal is opened</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Undergarments, lingerie, swimwear, and socks</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Customized personalized gifts and perishable grocery goods</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-500 font-bold">•</span>
                <span>Items marked as "Final Clearance / Non-Returnable" on product page</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Support Banner */}
        <div className="text-center bg-slate-900 rounded-3xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">Need help with an ongoing return?</h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-xl mx-auto">
            Our dispute resolution team is available round the clock to ensure you get your refund promptly.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/help"
              className="px-6 py-2.5 bg-white text-slate-900 text-xs font-semibold rounded-xl hover:bg-slate-100 transition"
            >
              Browse Help Center
            </Link>
            <Link
              to="/contact"
              className="px-6 py-2.5 bg-purple-600 text-white text-xs font-semibold rounded-xl hover:bg-purple-700 transition"
            >
              Contact Support Team
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
