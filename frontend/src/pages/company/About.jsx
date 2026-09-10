import { Sparkles, Users, Award, Shield, Zap, Globe, Heart } from "lucide-react";
import { Link } from "react-router-dom";

function About() {
    const stats = [
        { label: "Happy Shoppers", value: "2M+" },
        { label: "Verified Brands", value: "500+" },
        { label: "Pincodes Covered", value: "19,000+" },
        { label: "Average Rating", value: "4.9/5" },
    ];

    const values = [
        {
            icon: <Shield className="w-6 h-6 text-purple-600" />,
            title: "100% Genuine Products",
            desc: "Every item on Bazario is strictly verified directly from trusted manufacturers and authorized distributors.",
        },
        {
            icon: <Zap className="w-6 h-6 text-amber-500" />,
            title: "Lightning Deliveries",
            desc: "Powered by smart regional fulfillment centers across India for express same-day and next-day shipments.",
        },
        {
            icon: <Heart className="w-6 h-6 text-red-500" />,
            title: "Customer-First Culture",
            desc: "No-questions-asked 7-day returns, instant refunds, and 24/7 dedicated human support.",
        },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="badge badge-primary text-xs py-1.5 px-3 mb-3 inline-block">
                    About Bazario
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                    Redefining the standard of online shopping in India.
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Founded in 2024, Bazario was built on a simple conviction: premium quality, transparent pricing, and delightful customer experiences shouldn't be luxury exceptions — they should be the daily standard.
                </p>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20">
                {stats.map((stat, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl p-6 sm:p-8 text-center border border-purple-100/60 shadow-sm"
                    >
                        <p className="text-3xl sm:text-4xl font-extrabold text-purple-600" style={{ fontFamily: "var(--font-heading)" }}>
                            {stat.value}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Story Section */}
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-20 bg-white rounded-3xl p-8 sm:p-12 border border-purple-100/60 shadow-sm">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2 block">
                        Our Mission
                    </span>
                    <h2 className="text-3xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                        Connecting millions of buyers with authentic, world-class creators.
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-4 text-sm sm:text-base">
                        We started Bazario to fix what was broken with existing marketplaces: counterfeit products, frustrating return policies, and endless hidden fees.
                    </p>
                    <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                        Today, Bazario is a thriving ecosystem supporting hundreds of independent creators and top global electronics, fashion, lifestyle, and book brands — delivering happiness to your doorstep every single day.
                    </p>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-4/3 bg-gray-100 shadow-md">
                    <img
                        src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop"
                        alt="Bazario team collaboration"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Values Section */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                        What We Stand For
                    </h2>
                    <p className="text-gray-500 text-sm mt-2">
                        The core pillars behind every decision we make.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {values.map((v, i) => (
                        <div key={i} className="bg-white rounded-2xl p-8 border border-purple-100/60 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-5">
                                {v.icon}
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                {v.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                                {v.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Call to action */}
            <div className="rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #4C1D95 0%, #6C3EF4 50%, #A855F7 100%)" }}>
                <h2 className="text-3xl font-extrabold mb-3" style={{ fontFamily: "var(--font-heading)" }}>
                    Ready to discover your next favorite item?
                </h2>
                <p className="text-purple-100 text-sm max-w-md mx-auto mb-6">
                    Browse our curated collections and enjoy complimentary free shipping on your first order.
                </p>
                <Link to="/" className="inline-flex items-center gap-2 bg-white text-purple-700 font-bold px-8 py-3.5 rounded-full hover:bg-purple-50 transition-all shadow-lg hover:scale-105">
                    Start Shopping Now
                </Link>
            </div>
        </div>
    );
}

export default About;
