import { Briefcase, MapPin, Clock, ArrowRight, Heart, Sparkles, Coffee, Laptop } from "lucide-react";
import toast from "react-hot-toast";

const JOBS = [
    {
        title: "Senior Fullstack Engineer (React & Node.js)",
        dept: "Engineering",
        location: "Bengaluru, India / Hybrid",
        type: "Full-Time",
        exp: "4-6 Years",
    },
    {
        title: "Lead UI/UX Product Designer",
        dept: "Design & Product",
        location: "Mumbai, India / Remote",
        type: "Full-Time",
        exp: "3-5 Years",
    },
    {
        title: "Growth & Performance Marketing Specialist",
        dept: "Marketing",
        location: "Delhi NCR, India / Hybrid",
        type: "Full-Time",
        exp: "2-4 Years",
    },
    {
        title: "Category Operations Manager (Electronics & Lifestyle)",
        dept: "Operations",
        location: "Bengaluru, India",
        type: "Full-Time",
        exp: "3-6 Years",
    },
    {
        title: "Customer Delight & Experience Associate",
        dept: "Support",
        location: "Remote (India)",
        type: "Full-Time",
        exp: "1-3 Years",
    },
];

function Careers() {
    const handleApply = (jobTitle) => {
        toast.success(`Application initiated for: ${jobTitle}! Send your resume to careers@bazario.com`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Hero */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="badge badge-primary text-xs py-1.5 px-3 mb-3 inline-block">
                    Join Bazario
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-5" style={{ fontFamily: "var(--font-heading)" }}>
                    Build the next era of e-commerce with us.
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    We're a passionate, high-velocity team transforming online commerce for hundreds of millions of people. Discover open positions and craft your best work here.
                </p>
            </div>

            {/* Perks grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                <div className="bg-white p-6 rounded-2xl border border-purple-100/60 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
                        <Laptop className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Flexible & Hybrid</h3>
                    <p className="text-xs text-gray-500">Work from home or our world-class hubs in Bengaluru and Mumbai.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-purple-100/60 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Generous ESOPs</h3>
                    <p className="text-xs text-gray-500">Meaningful equity ownership so everyone wins as Bazario grows.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-purple-100/60 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Comprehensive Health</h3>
                    <p className="text-xs text-gray-500">Full medical and wellness coverage for you and your dependents.</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-purple-100/60 shadow-sm text-center">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                        <Coffee className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-1" style={{ fontFamily: "var(--font-heading)" }}>Annual Learning Fund</h3>
                    <p className="text-xs text-gray-500">₹75,000 yearly stipend for books, conferences, and technical courses.</p>
                </div>
            </div>

            {/* Job Listings */}
            <div className="mb-20">
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
                    <div>
                        <span className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-1 block">
                            Open Opportunities
                        </span>
                        <h2 className="text-3xl font-extrabold text-gray-900" style={{ fontFamily: "var(--font-heading)" }}>
                            Current Openings ({JOBS.length})
                        </h2>
                    </div>
                </div>

                <div className="space-y-4">
                    {JOBS.map((job, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl p-6 sm:p-7 border border-purple-100/60 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                        >
                            <div>
                                <span className="badge badge-primary text-[10px] mb-2 inline-block">
                                    {job.dept}
                                </span>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2" style={{ fontFamily: "var(--font-heading)" }}>
                                    {job.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-purple-500" /> {job.location}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3.5 h-3.5 text-purple-500" /> {job.type}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Briefcase className="w-3.5 h-3.5 text-purple-500" /> {job.exp}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleApply(job.title)}
                                className="btn-primary text-xs py-3 px-6 shrink-0 flex items-center justify-center gap-2 self-start md:self-auto"
                            >
                                <span>Apply Now</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Careers;
