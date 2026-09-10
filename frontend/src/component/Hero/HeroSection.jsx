import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const banners = [
    {
        title: "Big Sale 2026",
        subtitle: "Up to 70% OFF on Premium Electronics",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=2000&auto=format&fit=crop",
        cta: "Shop Electronics"
    },
    {
        title: "Autumn Collection",
        subtitle: "Trending Styles & Fashion for Everyone",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
        cta: "Explore Fashion"
    },
    {
        title: "Home Essentials",
        subtitle: "Upgrade Your Space with Modern Decor",
        image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2000&auto=format&fit=crop",
        cta: "Decorate Now"
    },
];

function HeroSection() {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        }, 5000); // 5 seconds timer
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[60vh] min-h-[450px] lg:h-[75vh] rounded-3xl overflow-hidden group shadow-2xl mb-12">
            {banners.map((banner, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                        index === current ? "opacity-100 z-10" : "opacity-0 z-0"
                    }`}
                >
                    {/* Background Image */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center transform hover:scale-105 transition-transform duration-[10s]"
                        style={{ backgroundImage: `url(${banner.image})` }}
                    />
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
                        <div className="max-w-xl text-left transform transition-all duration-700 translate-y-0 opacity-100">
                            <span className="inline-block py-1 px-3 rounded-full bg-blue-500/20 text-blue-300 font-semibold tracking-widest text-sm uppercase mb-4 border border-blue-500/30 backdrop-blur-sm">
                                ShopHub Exclusive
                            </span>
                            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg">
                                {banner.title}
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-200 mb-8 font-light drop-shadow-md">
                                {banner.subtitle}
                            </p>
                            <button className="flex items-center gap-2 bg-white text-gray-900 px-8 py-3.5 rounded-full font-bold hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-[0_10px_20px_rgba(0,0,0,0.2)]">
                                {banner.cta} <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-3">
                {banners.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            index === current ? "bg-blue-500 w-8" : "bg-white/50 hover:bg-white/80"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default HeroSection;