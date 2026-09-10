import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Truck, LockKeyhole, RotateCcw, Star, ArrowRight, Zap, Shirt, Sparkles, Home as HomeIcon } from "lucide-react";
import HeroSection from "../component/Hero/HeroSection.jsx";
import ProductCard from "../component/product/ProductCard.jsx";
import ProductSkeleton from "../component/product/ProductSkeleton.jsx";
import { getAllProducts } from "../features/product/productAPI";

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
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                // Fetch just a few newest products
                const response = await getAllProducts({ sort: "newest" });
                setFeaturedProducts((response.product || []).slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch featured products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

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
                    {HIGHLIGHT_CATEGORIES.map((cat) => (
                        <Link 
                            key={cat.name} 
                            to={cat.path} 
                            className={`group relative rounded-3xl overflow-hidden bg-slate-100 ${cat.colSpan} ${cat.rowSpan}`}
                        >
                            <img 
                                src={cat.image} 
                                alt={cat.name} 
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                loading="lazy"
                            />
                            
                            {/* Subtle gradient overlay to ensure text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
                            
                            <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                                <div className="text-white mb-3 bg-white/20 backdrop-blur-md w-12 h-12 flex items-center justify-center rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    {cat.icon}
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight leading-none mb-1">{cat.name}</h3>
                                <p className="text-slate-300 text-sm font-medium">{cat.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ── Featured Products Section ─────────────────── */}
            <section className="mb-24">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-black tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                            New Arrivals
                        </h2>
                        <p className="text-slate-500 mt-2 text-sm sm:text-base">The latest additions to our collection</p>
                    </div>
                    <Link to="/shop?sort=newest" className="hidden sm:flex items-center gap-2 text-xs font-bold text-purple-600 hover:text-purple-700 uppercase tracking-widest transition-colors">
                        Shop Now <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <ProductSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                        {featuredProducts.map((prod) => (
                            <ProductCard key={prod._id} product={prod} />
                        ))}
                    </div>
                )}
                
                <div className="mt-10 text-center sm:hidden">
                    <Link to="/shop" className="inline-flex items-center justify-center w-full py-4 border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 uppercase tracking-widest rounded-2xl">
                        View All Products
                    </Link>
                </div>
            </section>

            {/* ── Why Choose Bazario ────────────────── */}
            <section className="mb-12 border-t border-slate-100 pt-16">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {FEATURES.map((feat) => (
                        <div key={feat.title} className="text-left bg-slate-50 p-8 rounded-3xl border border-slate-100">
                            <div className="text-purple-600 mb-5 bg-purple-100 w-14 h-14 flex items-center justify-center rounded-2xl">
                                {feat.icon}
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2 tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                                {feat.title}
                            </h3>
                            <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                {feat.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default Home;