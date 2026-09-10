import { Link } from "react-router-dom";
import { ArrowRight, PlayCircle } from "lucide-react";

function HeroSection() {
    return (
        <section className="relative w-full rounded-3xl mb-16 sm:mb-24 overflow-hidden bg-slate-50 border border-slate-200">
            
            <div className="flex flex-col lg:flex-row items-center min-h-[600px]">
                
                {/* ── Left Content (Text) ── */}
                <div className="flex-1 px-8 sm:px-16 md:px-20 py-16 lg:py-0 z-10 flex flex-col justify-center">

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                        Power. <br/>
                        <span className="text-slate-400">Perfected.</span>
                    </h1>

                    <p className="text-base sm:text-lg text-slate-600 mb-10 max-w-md leading-relaxed font-medium">
                        Experience the next generation of premium electronics. Unrivaled performance meets stunning, minimalist design.
                    </p>

                    <div className="flex flex-wrap items-center gap-4">
                        <Link 
                            to="/shop?category=Electronics"
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold tracking-widest uppercase text-xs rounded-full transition-all shadow-[0_8px_30px_rgb(147,51,234,0.3)] hover:shadow-[0_8px_30px_rgb(147,51,234,0.5)] hover:-translate-y-0.5"
                        >
                            Shop Pro Series
                        </Link>
                        
                        <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 font-bold tracking-widest uppercase text-xs rounded-full transition-all">
                            <PlayCircle className="w-4 h-4 text-purple-600" />
                            Watch Film
                        </button>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-12 pt-8 border-t border-slate-200 flex items-center gap-8">
                        <div>
                            <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter">48hr</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Battery Life</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200"></div>
                        <div>
                            <p className="text-2xl font-black text-slate-900 font-mono tracking-tighter">OLED</p>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Display Tech</p>
                        </div>
                    </div>
                </div>

                {/* ── Right Content (Image) ── */}
                <div className="flex-1 relative w-full h-[400px] lg:h-[600px] bg-slate-100 flex items-center justify-center overflow-hidden border-l border-slate-200">
                    
                    {/* Decorative abstract shape behind product */}
                    <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-purple-100/50 to-transparent rounded-full blur-3xl opacity-60"></div>
                    
                    {/* The premium colored product photo */}
                    <img
                        src="https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=1000&auto=format&fit=crop"
                        alt="Premium Electronics"
                        className="relative z-10 w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000 ease-out"
                        loading="eager"
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent mix-blend-multiply"></div>
                </div>

            </div>
        </section>
    );
}

export default HeroSection;