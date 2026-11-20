import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Truck, LockKeyhole, RotateCcw, Star, ArrowRight, Zap, Shirt, Sparkles, Home as HomeIcon } from "lucide-react";
import HeroSection from "../component/Hero/HeroSection.jsx";
import ProductCard from "../component/product/ProductCard.jsx";
import ProductSkeleton from "../component/product/ProductSkeleton.jsx";
import { getAllProducts } from "../features/product/productAPI";
import SellerDashboared from "./seller/SellerDashboared.jsx";

const FEATURES = [
    {
        icon: <Truck className="w-6 h-6" />,
        title: "Free Shipping",
        desc: "Free delivery on all orders above ₹499 across India.",
    },
    {
        icon: <LockKeyhole className="w-6 h-6" />,
        title: "Secure Payment",
        desc: "100% secure online payment with trusted gateways.",
    },
    {
        icon: <RotateCcw className="w-6 h-6" />,
        title: "Easy Returns",
        desc: "Hassle-free return & refund policy within 7 days.",
    },
    {
        icon: <Star className="w-6 h-6" />,
        title: "Top Quality",
        desc: "Carefully selected products with top-notch quality.",
    },
];

const HIGHLIGHT_CATEGORIES = [
    { 
        name: "Electronics", 
        desc: "Next-gen tech",
        icon: <Zap className="w-6 h-6" />, 
        path: "/shop?category=Electronics", 
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800&auto=format&fit=crop",
        colSpan: "lg:col-span-2",
        rowSpan: "lg:row-span-2"
    },
    { 
        name: "Fashion", 
        desc: "Trending styles",
        icon: <Shirt className="w-6 h-6" />, 
        path: "/shop?category=Fashion", 
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800&auto=format&fit=crop",
        colSpan: "lg:col-span-1",
        rowSpan: "lg:row-span-1"
    },
    { 
        name: "Home", 
        desc: "Modern living",
        icon: <HomeIcon className="w-6 h-6" />, 
        path: "/shop?category=Home", 
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
        colSpan: "lg:col-span-1",
        rowSpan: "lg:row-span-1"
    },
    { 
        name: "Beauty", 
        desc: "Premium care",
        icon: <Sparkles className="w-6 h-6" />, 
        path: "/shop?category=Beauty", 
        image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=800&auto=format&fit=crop",
        colSpan: "lg:col-span-2",
        rowSpan: "lg:row-span-1"
    }
];

function Home() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products only if not a seller
        if (user?.role === "seller") return;

        const fetchFeatured = async () => {
            try {
                const response = await getAllProducts({ sort: "newest" });
                setFeaturedProducts((response.product || []).slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, [user?.role]);

    // 🛑 If logged in as SELLER: Show Seller Dashboard instead of Buyer Home Page!
    if (isAuthenticated && user?.role === "seller") {
        return (
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <SellerDashboared />
            </main>
        );
    }

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 bg-white font-sans text-slate-900">
            {/* ── Hero ─────────────────────────────── */}
            <HeroSection />

            {/* ── Featured Categories (Bento Grid) ─────────────────── */}
            <section className="mb-24">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                            Curated Collections
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm sm:text-base">Explore our most popular departments</p>
                    </div>
                    <Link to="/shop" className="hidden sm:flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 uppercase tracking-widest transition-colors">
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {/* Bento Box Layout */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[250px] gap-4">
                    {HIGHLIGHT_CATEGORIES.map((cat, idx) => (
                        <Link 
                            key={idx} 
                            to={cat.path}
                            className={`group relative rounded-3xl overflow-hidden border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 ${cat.colSpan} ${cat.rowSpan}`}
                        >
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 flex items-end justify-between">
                                <div>
                                    <span className="text-white/70 text-xs font-bold tracking-widest uppercase mb-1 block">{cat.desc}</span>
                                    <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{cat.name}</h3>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-purple-600 transition-colors">
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Featured Products Carousel/Grid ──────────────────── */}
            <section className="mb-24">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                            New Arrivals
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm sm:text-base">The freshest drops from top premium brands</p>
                    </div>
                    <Link to="/shop?sort=newest" className="hidden sm:flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 uppercase tracking-widest transition-colors">
                        Browse New <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {[...Array(4)].map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {featuredProducts.map((p) => (
                            <ProductCard key={p._id} product={p} />
                        ))}
                    </div>
                )}
            </section>

            {/* ── Value Props ──────────────────────────────────────── */}
            <section className="py-12 border-t border-slate-100">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors">
                            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                                {f.icon}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm text-slate-900">{f.title}</h3>
                                <p className="text-xs text-slate-500 mt-0.5 font-medium leading-relaxed">{f.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Home;
