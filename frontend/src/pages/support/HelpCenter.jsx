import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HelpCircle, 
  Truck, 
  CreditCard, 
  RotateCcw, 
  ShieldCheck, 
  ChevronDown, 
  Search, 
  MessageSquare, 
  PhoneCall, 
  Mail,
  ExternalLink
} from 'lucide-react';
import toast from 'react-hot-toast';

const FAQ_CATEGORIES = [
  {
    id: 'orders',
    name: 'Orders & Shipping',
    icon: Truck,
    color: 'bg-blue-50 text-blue-600',
    questions: [
      {
        q: 'How do I track my order in real-time?',
        a: 'Once your order is dispatched, you will receive an SMS and email with a live tracking link. You can also visit our Track Order page and enter your Bazario Order ID to see current transit status.'
      },
      {
        q: 'What are the delivery timelines?',
        a: 'Standard delivery takes 3–5 business days across metro cities and 5–7 days for remote locations. Express delivery (available at checkout for select PIN codes) delivers within 24–48 hours.'
      },
      {
        q: 'Can I change my delivery address after placing an order?',
        a: 'You can modify the delivery address within 1 hour of placing the order via the "My Orders" tab. Once an item is packed or handed over to courier partners, address alterations are not permitted.'
      }
    ]
  },
  {
    id: 'payments',
    name: 'Payments & Refunds',
    icon: CreditCard,
    color: 'bg-emerald-50 text-emerald-600',
    questions: [
      {
        q: 'Which payment methods are supported on Bazario?',
        a: 'We accept all major UPI apps (Google Pay, PhonePe, Paytm), Credit/Debit cards (Visa, MasterCard, RuPay), Net Banking across 50+ banks, and Cash on Delivery (COD) on eligible orders.'
      },
      {
        q: 'My payment was debited but the order failed. What should I do?',
        a: 'Do not worry! In such cases, the amount is automatically reversed to your original payment source within 24 to 48 hours by your bank or payment gateway.'
      },
      {
        q: 'How long does a refund take to process?',
        a: 'Once your returned product passes quality inspection at our warehouse, refunds are initiated within 24 hours. Credit cards and net banking typically reflect funds in 3-5 business days; UPI refunds are instant.'
      }
    ]
  },
  {
    id: 'returns',
    name: 'Returns & Replacements',
    icon: RotateCcw,
    color: 'bg-purple-50 text-purple-600',
    questions: [
      {
        q: 'What is Bazario\'s return policy?',
        a: 'We offer a hassle-free 7-day return and replacement policy on most products. Items must be unused, in original packaging, and with all tags intact.'
      },
      {
        q: 'How do I initiate a return or exchange?',
        a: 'Navigate to "My Orders", choose the item you wish to return, select a reason, and schedule a convenient doorstep pickup. Our courier partner will pick it up within 48 hours.'
      },
      {
        q: 'Are there non-returnable categories?',
        a: 'For hygiene and safety reasons, intimate apparel, customized/personalized items, and unsealed beauty cosmetics are non-returnable unless received damaged or defective.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Security',
    icon: ShieldCheck,
    color: 'bg-amber-50 text-amber-600',
    questions: [
      {
        q: 'How do I reset my password if I forget it?',
        a: 'Click on "Sign In", select "Forgot Password?", and enter your registered email address. We will send you a secure password reset link valid for 15 minutes.'
      },
      {
        q: 'Is my card and personal information secure?',
        a: 'Yes, absolutely. We use 256-bit bank-grade SSL encryption and comply with RBI and PCI-DSS standards. We never store your full CVV or raw card PIN numbers.'
      },
      {
        q: 'Can I delete my Bazario account?',
        a: 'Yes, you can request account deletion from your Account Settings under the "Privacy & Data" tab. Your request will be fulfilled within 14 business days.'
      }
    ]
  }
];

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const currentCategoryData = FAQ_CATEGORIES.find(c => c.id === activeCategory);

  // Filter if search query exists
  const filteredQuestions = searchQuery.trim()
    ? FAQ_CATEGORIES.flatMap(cat => 
        cat.questions
          .filter(q => q.q.toLowerCase().includes(searchQuery.toLowerCase()) || q.a.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(q => ({ ...q, categoryName: cat.name }))
      )
    : currentCategoryData?.questions || [];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            24/7 Customer Assistance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How can we help you today?
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Find quick answers to your questions about orders, shipping, refunds, payments, and Bazario account features.
          </p>

          {/* Search Box */}
          <div className="mt-6 max-w-xl mx-auto relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search for questions (e.g. 'refund', 'tracking', 'UPI')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm text-slate-800 placeholder-slate-400 transition"
            />
          </div>
        </div>

        {/* Categories Bar (hidden if searching) */}
        {!searchQuery && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {FAQ_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setActiveCategory(cat.id);
                    setOpenFaq(null);
                  }}
                  className={`flex flex-col items-center p-4 rounded-2xl border transition-all text-center ${
                    isActive
                      ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-100'
                      : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs sm:text-sm font-semibold ${isActive ? 'text-purple-700' : 'text-slate-700'}`}>
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 mb-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">
              {searchQuery ? `Search Results (${filteredQuestions.length})` : currentCategoryData?.name}
            </h2>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-purple-600 hover:underline"
              >
                Clear search
              </button>
            )}
          </div>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600 font-medium">No answers found for "{searchQuery}"</p>
              <p className="text-xs text-slate-400 mt-1">Try another keyword or contact our live support team below.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredQuestions.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-4 first:pt-0 last:pb-0">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left group"
                    >
                      <div>
                        {faq.categoryName && (
                          <span className="text-[10px] font-bold tracking-wider uppercase text-purple-600 block mb-1">
                            {faq.categoryName}
                          </span>
                        )}
                        <span className="text-sm sm:text-base font-semibold text-slate-800 group-hover:text-purple-600 transition">
                          {faq.q}
                        </span>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 ml-4 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-purple-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 pr-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Live Chat</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Chat with our friendly support bots and customer heroes.</p>
            <button
              onClick={() => toast.success('Live chat initiated! An agent will join shortly.')}
              className="w-full py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold rounded-xl transition"
            >
              Start Chat
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Email Us</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Get guaranteed responses within 4 working hours.</p>
            <Link
              to="/contact"
              className="inline-block w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold rounded-xl transition"
            >
              Send Ticket
            </Link>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Call Us</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">Toll-free customer line (9 AM – 9 PM IST daily).</p>
            <a
              href="tel:1800123456"
              className="inline-block w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-xl transition"
            >
              1800-123-456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
