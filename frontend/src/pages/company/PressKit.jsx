import { Download, FileText, Image, Newspaper, Award, Mail } from "lucide-react";
import toast from "react-hot-toast";

function PressKit() {
    const handleDownload = (assetName) => {
        toast.success(`Download started for ${assetName}!`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="badge badge-primary text-xs py-1.5 px-3 mb-3 inline-block">
                    Media & Press
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Bazario Press Kit & Brand Assets
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Official company facts, downloadable high-resolution logos, brand guidelines, and executive media contact details.
                </p>
            </div>

            {/* Quick Fact Sheet */}
            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-purple-100/60 shadow-sm mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                    Bazario at a Glance
                </h2>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-400 font-bold uppercase">Headquarters</p>
                        <p className="text-base font-bold text-gray-900 mt-1">Bengaluru, Karnataka, India</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-400 font-bold uppercase">Founded</p>
                        <p className="text-base font-bold text-gray-900 mt-1">2024</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-400 font-bold uppercase">Customer Base</p>
                        <p className="text-base font-bold text-gray-900 mt-1">2M+ Active Shoppers across India</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-400 font-bold uppercase">Catalog Size</p>
                        <p className="text-base font-bold text-gray-900 mt-1">10,000+ Curated Products</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-400 font-bold uppercase">Categories</p>
                        <p className="text-base font-bold text-gray-900 mt-1">Electronics, Fashion, Books, Beauty, Sports, Home</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50">
                        <p className="text-xs text-gray-400 font-bold uppercase">Press Contact</p>
                        <p className="text-base font-bold text-purple-600 mt-1">press@bazario.com</p>
                    </div>
                </div>
            </div>

            {/* Brand Asset Downloads */}
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "var(--font-heading)" }}>
                    Official Brand Assets
                </h2>

                <div className="grid sm:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-purple-100/60 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                                <Image className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Vector Logos Pack</h3>
                            <p className="text-xs text-gray-500 mb-5">SVG, EPS, and high-res PNG formats for dark and light backgrounds.</p>
                        </div>
                        <button
                            onClick={() => handleDownload("Vector Logos Pack (ZIP)")}
                            className="btn-primary text-xs py-2.5 px-4 w-full flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Download (14 MB)
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-purple-100/60 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                                <FileText className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Brand Style Guide</h3>
                            <p className="text-xs text-gray-500 mb-5">Color palettes, typography rules, clear space guidelines, and usage dos & don'ts.</p>
                        </div>
                        <button
                            onClick={() => handleDownload("Brand Style Guide (PDF)")}
                            className="btn-primary text-xs py-2.5 px-4 w-full flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Download (4.2 MB)
                        </button>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-purple-100/60 shadow-sm flex flex-col justify-between">
                        <div>
                            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
                                <Newspaper className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Executive Media Kit</h3>
                            <p className="text-xs text-gray-500 mb-5">Founder headshots, bio summaries, company timeline, and milestone announcements.</p>
                        </div>
                        <button
                            onClick={() => handleDownload("Executive Media Kit (ZIP)")}
                            className="btn-primary text-xs py-2.5 px-4 w-full flex items-center justify-center gap-2"
                        >
                            <Download className="w-4 h-4" /> Download (28 MB)
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PressKit;
