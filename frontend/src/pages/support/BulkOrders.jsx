import React, { useState } from 'react';
import { 
  Building2, 
  Percent, 
  FileSpreadsheet, 
  Truck, 
  ShieldCheck, 
  Gift, 
  ArrowRight, 
  CheckCircle2, 
  PhoneCall,
  Mail
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function BulkOrders() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    category: 'Electronics & Gadgets',
    quantity: '50-100 units',
    gstin: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email || !formData.phone) {
      toast.error('Please fill in all mandatory fields');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success('B2B Quote Request Received! A corporate account manager will contact you in 2 hours.', {
        duration: 5000,
        icon: '💼'
      });
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        category: 'Electronics & Gadgets',
        quantity: '50-100 units',
        gstin: '',
        notes: ''
      });
    }, 1200);
  };

  const tiers = [
    {
      units: '25 – 99 Units',
      discount: '15% OFF',
      tagline: 'Ideal for small team rewards & event hampers',
      features: ['Standard doorstep delivery', 'GST Invoice with input tax credit', 'Basic custom packaging']
    },
    {
      units: '100 – 499 Units',
      discount: '25% OFF',
      popular: true,
      tagline: 'Best for festive corporate gifting & enterprise bundles',
      features: ['Dedicated Account Manager', 'Custom logo co-branding', 'Split-delivery to multiple office locations', 'Priority fulfillment dispatch']
    },
    {
      units: '500+ Units',
      discount: 'Up to 40% OFF',
      tagline: 'Wholesale & institutional procurement',
      features: ['Customized manufacturing options', '30-day net credit payment terms', 'Sample verification before bulk run', 'Direct factory-floor logistics']
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold mb-4">
            <Building2 className="w-4 h-4" />
            Bazario B2B & Enterprise Solutions
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Corporate Gifting & Wholesale Bulk Orders
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-2xl mx-auto">
            Get exclusive institutional pricing, 100% GST tax credit, custom logo packaging, and pan-India multi-location dispatch.
          </p>
        </div>

        {/* Tier Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                tier.popular
                  ? 'bg-slate-900 text-white shadow-xl ring-2 ring-purple-500 scale-[1.02]'
                  : 'bg-white border border-slate-200 text-slate-900 shadow-sm'
              }`}
            >
              <div>
                {tier.popular && (
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-500 text-white text-[10px] font-bold tracking-wider uppercase mb-3">
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-bold">{tier.units}</h3>
                <div className="text-3xl font-black text-purple-400 mt-2 mb-2">
                  {tier.discount}
                </div>
                <p className={`text-xs mb-6 ${tier.popular ? 'text-slate-300' : 'text-slate-500'}`}>
                  {tier.tagline}
                </p>

                <ul className="space-y-3 text-xs mb-8">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${tier.popular ? 'text-purple-400' : 'text-emerald-500'}`} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href="#quote-form"
                className={`w-full py-2.5 text-center rounded-xl text-xs font-semibold transition ${
                  tier.popular
                    ? 'bg-purple-600 hover:bg-purple-700 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                Inquire for {tier.units}
              </a>
            </div>
          ))}
        </div>

        {/* Benefits Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
            <FileSpreadsheet className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">GST Input Credit</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Claim 18% GST benefits</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
            <Gift className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">Custom Branding</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Laser-etched logo options</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
            <Truck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">Multi-Location Drop</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Ship to 1,000+ employee homes</div>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 text-center">
            <ShieldCheck className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">Quality Verified</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Direct from certified brands</div>
          </div>
        </div>

        {/* Interactive Quote Request Form */}
        <div id="quote-form" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10 mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Request an Enterprise Quote</h2>
          <p className="text-xs sm:text-sm text-slate-500 mb-8">
            Tell us about your organization and requirements. Our corporate team will share a personalized proposal within 2 business hours.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company / Institution Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Tech Solutions Ltd."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Contact Person Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Sharma"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Official Work Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@acmetech.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone / Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Target Product Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="Electronics & Gadgets">Electronics & Tech Accessories</option>
                  <option value="Apparel & Fashion">Apparel & Customized Merchandise</option>
                  <option value="Wellness & Hampers">Wellness & Gourmet Hampers</option>
                  <option value="Home & Lifestyle">Home & Lifestyle Accessories</option>
                  <option value="Mixed Categories">Mixed Multi-Category Catalog</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Estimated Order Volume
                </label>
                <select
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="25-50 units">25 - 50 units</option>
                  <option value="50-100 units">50 - 100 units</option>
                  <option value="100-500 units">100 - 500 units</option>
                  <option value="500+ units">500+ units (Custom Volume)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                GSTIN Number (Optional - for tax invoices)
              </label>
              <input
                type="text"
                placeholder="27ABCDE1234F1Z5"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Additional Requirements / Specific Deliverables
              </label>
              <textarea
                rows={3}
                placeholder="Let us know your budget, required delivery dates, or custom gift box branding specifications..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Quote Request...
                </>
              ) : (
                <>
                  Submit Bulk Order Request
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Dedicated Desk Contact */}
        <div className="text-center text-xs text-slate-500">
          Need urgent procurement for an immediate event? Email our VP of Enterprise Sales at{' '}
          <a href="mailto:b2b@bazario.com" className="text-purple-600 font-semibold hover:underline">
            b2b@bazario.com
          </a>{' '}
          or call <span className="font-semibold text-slate-700">+91 (80) 4192-8000</span>
        </div>
      </div>
    </div>
  );
}
