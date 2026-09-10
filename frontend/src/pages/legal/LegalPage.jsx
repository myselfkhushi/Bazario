import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Shield, FileText, Cookie, RotateCcw, Lock, CheckCircle, AlertCircle } from 'lucide-react';

export default function LegalPage({ initialTab = 'privacy' }) {
  const location = useLocation();

  // Determine active tab from URL path if possible
  const getTabFromPath = () => {
    const path = location.pathname;
    if (path.includes('terms')) return 'terms';
    if (path.includes('cookies')) return 'cookies';
    if (path.includes('refund')) return 'refund';
    return initialTab;
  };

  const [activeTab, setActiveTab] = useState(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const tabs = [
    { id: 'privacy', label: 'Privacy Policy', path: '/privacy', icon: Shield },
    { id: 'terms', label: 'Terms of Service', path: '/terms', icon: FileText },
    { id: 'cookies', label: 'Cookie Policy', path: '/cookies', icon: Cookie },
    { id: 'refund', label: 'Refund & Cancellation', path: '/refund', icon: RotateCcw }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-semibold mb-4">
            <Lock className="w-3.5 h-3.5" />
            Bazario Trust & Compliance
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Legal & Policy Center
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Last Updated: September 01, 2026 • Compliant with IT Act 2000 & Digital Personal Data Protection (DPDP) Act
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 rounded-2xl mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  isActive
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Document Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 prose prose-slate max-w-none text-slate-700">
          {/* Privacy Policy */}
          {activeTab === 'privacy' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-600" />
                Privacy Policy
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                At Bazario ("we", "our", or "us"), we value the trust you place in us when sharing your personal information. This Privacy Policy outlines our principles and practices concerning the collection, use, storage, and disclosure of personal data collected through Bazario’s website and mobile applications.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">1. Information We Collect</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                We collect personal identifiers such as your name, delivery address, phone number, and email address when you register an account, make a purchase, or contact customer support. For guest shoppers, temporary device tokens and wishlist selections are cached locally in your browser and are never transmitted to third parties without your explicit consent.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">2. How We Use Your Data</h3>
              <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm text-slate-600 mb-6">
                <li>Processing transactions, arranging door-to-door courier dispatch, and providing real-time order tracking notifications.</li>
                <li>Preventing fraud, mitigating abusive purchase patterns, and securing payment gateway interactions.</li>
                <li>Delivering personalized recommendations, tailored discounts, and transactional communications.</li>
              </ul>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">3. Payment Information Security</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Bazario does not retain or store sensitive credit card numbers or banking CVVs on our servers. All financial transactions are processed directly through RBI-authorized payment processors adhering to PCI-DSS Level 1 compliance standards.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">4. Your Data Rights & Grievance Officer</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                In compliance with the Digital Personal Data Protection Act, you possess the right to inspect, update, or request the deletion of your personal records. For inquiries, contact our appointed Grievance Officer at <a href="mailto:grievance@bazario.com" className="text-purple-600 font-semibold underline">grievance@bazario.com</a>.
              </p>
            </div>
          )}

          {/* Terms of Service */}
          {activeTab === 'terms' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                Terms of Service
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Welcome to Bazario. By accessing or using our marketplace platform, you agree to be bound by the terms, conditions, and notices contained herein. Please read them attentively before utilizing our services.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">1. Account Eligibility & Responsibility</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                You must be at least 18 years of age or access the website under parental supervision. You are responsible for preserving the confidentiality of your credentials and restrict unauthorized access to your account.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">2. Product Descriptions & Pricing</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                While Bazario strives to ensure all descriptions, imagery, and prices published are accurate, typographical errors may occasionally occur. In the event an item is listed at an incorrect price due to technical error, Bazario reserves the right to cancel any orders placed for such products prior to dispatch.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">3. Seller Marketplace Obligations</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Sellers operating on Bazario guarantee that their listed merchandise is authentic, free of counterfeit claims, and compliant with all Indian statutory trade benchmarks. Sellers are exclusively liable for warranty claims and product compliance.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">4. Governing Law</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                These terms shall be governed by and constructed in accordance with the laws of the Republic of India. Any disputes arising out of your usage shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka.
              </p>
            </div>
          )}

          {/* Cookie Policy */}
          {activeTab === 'cookies' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Cookie className="w-6 h-6 text-purple-600" />
                Cookie Policy
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                This Cookie Policy clarifies how Bazario utilizes cookies, local web storage tokens, and related tracking technologies to provide, secure, and enhance your shopping journey.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">1. What are Cookies?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Cookies are compact data snippets saved onto your computer, tablet, or smartphone when you visit digital domains. They enable the web platform to remember your actions, shopping cart preferences, and session tokens across visits.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">2. Types of Cookies We Deploy</h3>
              <div className="space-y-3 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900">Essential Technical Cookies</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Required for core functionality, such as keeping you authenticated and preserving items in your guest cart.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900">Performance & Analytics Cookies</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Helps us evaluate site speed, bounce rates, and user navigation paths to optimize page load metrics.</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="text-xs font-bold text-slate-900">Marketing & Personalization Cookies</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Assists our partner networks in presenting tailored promotional campaigns aligned with your product interests.</p>
                </div>
              </div>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">3. Controlling Your Preferences</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                You can configure your browser to decline non-essential cookies or notify you whenever a cookie is set. Note that disabling essential cookies may impact checkout workflows and item persistence.
              </p>
            </div>
          )}

          {/* Refund & Cancellation Policy */}
          {activeTab === 'refund' && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <RotateCcw className="w-6 h-6 text-purple-600" />
                Refund & Cancellation Policy
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Bazario is committed to offering a smooth, transparent buying experience. If you are not completely satisfied with a delivered item or need to cancel an unfulfilled order, our return policy guarantees complete peace of mind.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">1. Order Cancellations</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                You can cancel an order unconditionally at zero cancellation fee prior to warehouse dispatch. Once the parcel is handed over to the courier service, cancellations are no longer feasible via the portal, but you may refuse delivery at your doorstep.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">2. Return Window & Eligibility</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                Customers may file a return or exchange request within <strong>7 calendar days</strong> from the recorded date of delivery. Items returned must be undamaged, unwashed, and accompanied by the original manufacturer invoice, MRP tags, and intact barcode stickers.
              </p>

              <h3 className="text-base font-bold text-slate-900 mt-6 mb-2">3. Refund Processing Timelines</h3>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                  <thead className="bg-slate-100 text-slate-700 font-bold">
                    <tr>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Refund Initiation</th>
                      <th className="p-3">Reflection in Account</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-3 font-medium">UPI / Wallets</td>
                      <td className="p-3">Within 24 Hours</td>
                      <td className="p-3 text-emerald-600 font-semibold">Instant – 4 Hours</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Credit / Debit Card</td>
                      <td className="p-3">Within 24 Hours</td>
                      <td className="p-3">3 – 5 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Net Banking</td>
                      <td className="p-3">Within 24 Hours</td>
                      <td className="p-3">2 – 4 Business Days</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Cash on Delivery (COD)</td>
                      <td className="p-3">Within 24 Hours</td>
                      <td className="p-3">Direct NEFT to Bank / UPI ID within 48h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Contact Strip */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Have questions regarding our legal agreements? Contact our compliance desk at{' '}
          <a href="mailto:legal@bazario.com" className="text-purple-600 font-semibold hover:underline">
            legal@bazario.com
          </a>
        </div>
      </div>
    </div>
  );
}
