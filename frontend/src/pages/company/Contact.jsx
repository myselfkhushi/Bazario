import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";

function Contact() {
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(() => {
            setSubmitting(false);
            setSent(true);
            toast.success("Message sent successfully! Our team will respond within 24 hours.");
            e.target.reset();
        }, 800);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
                <span className="badge badge-primary text-xs py-1.5 px-3 mb-3 inline-block">
                    Get In Touch
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    We'd love to hear from you.
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Have a question about an order, want to partner with us as a seller, or just want to say hello? Drop us a line anytime.
                </p>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-start">
                {/* Contact Info Cards */}
                <div className="lg:col-span-5 space-y-5">
                    <div className="bg-white p-7 rounded-2xl border border-purple-100/60 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Email Support</h3>
                            <p className="text-xs text-gray-500 mb-2">Available 24 hours a day, 7 days a week.</p>
                            <a href="mailto:support@bazario.com" className="text-sm font-bold text-purple-600 hover:underline">
                                support@bazario.com
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-2xl border border-purple-100/60 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Customer Helpline</h3>
                            <p className="text-xs text-gray-500 mb-2">Toll-free across India (Mon-Sat, 9AM-8PM).</p>
                            <a href="tel:18001234567" className="text-sm font-bold text-emerald-600 hover:underline">
                                1800-123-4567
                            </a>
                        </div>
                    </div>

                    <div className="bg-white p-7 rounded-2xl border border-purple-100/60 shadow-sm flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Headquarters</h3>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Bazario Tech India Pvt. Ltd.<br />
                                4th Floor, Tech Hub Tower, Outer Ring Road,<br />
                                Bengaluru, Karnataka 560103
                            </p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-purple-100/60 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                        Send us a message
                    </h2>
                    <p className="text-xs text-gray-500 mb-6">
                        Fill out the form and our specialist team will get back to you promptly.
                    </p>

                    {sent && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            <span>Thank you! Your message has been received. We'll be in touch soon.</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Aakash Sharma"
                                    className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="aakash@example.com"
                                    className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Subject</label>
                            <input
                                type="text"
                                required
                                placeholder="Order Inquiry / Seller Partnership / Feedback"
                                className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Your Message</label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Tell us how we can help you today..."
                                className="w-full border border-gray-200 rounded-xl py-3 px-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Send Message</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Contact;
