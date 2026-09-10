import { Calendar, User, Clock, ArrowRight, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const POSTS = [
    {
        id: 1,
        title: "Top 7 Productivity Gadgets Every Remote Worker Needs in 2026",
        excerpt: "From noise-cancelling spatial acoustics to ergonomic mechanical desks, here are the investments that genuinely upgrade focus.",
        category: "Tech & Work",
        author: "Aakash Verma",
        date: "September 8, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "How to Build a Capsule Wardrobe with Sustainable French Linen",
        excerpt: "Less is undeniably more. A comprehensive guide to styling 6 foundational linen garments for endless effortless looks.",
        category: "Fashion & Style",
        author: "Khushi Kumari",
        date: "September 4, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "The Science of Better Sleep: Evaluating Contour Orthopedic Pillows",
        excerpt: "Why cervical spinal alignment during deep REM cycles eliminates morning migraines and chronic shoulder stiffness.",
        category: "Wellness & Home",
        author: "Dr. Rohit Sen",
        date: "August 29, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Dermatologist Breakdown: Why Vitamin C + Ferulic Acid is the Ultimate Glow Duo",
        excerpt: "Understanding clinical stability in antioxidant serums and why concentration matters for long-term collagen synthesis.",
        category: "Skincare",
        author: "Ananya Sharma",
        date: "August 22, 2026",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
    },
];

function Blog() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <span className="badge badge-primary text-xs py-1.5 px-3 mb-3 inline-block">
                    Bazario Journal
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4" style={{ fontFamily: "var(--font-heading)" }}>
                    Stories, guides & product wisdom.
                </h1>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                    Insightful deep dives into modern technology, timeless apparel, home architecture, and curated lifestyle recommendations.
                </p>
            </div>

            {/* Articles Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-16">
                {POSTS.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white rounded-3xl overflow-hidden border border-purple-100/60 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                    >
                        <div className="aspect-16/9 overflow-hidden bg-gray-100 relative">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <span className="absolute top-4 left-4 badge badge-primary text-xs bg-white/95 backdrop-blur-md">
                                {post.category}
                            </span>
                        </div>

                        <div className="p-7 sm:p-8 flex flex-col flex-1">
                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-3.5 h-3.5 text-purple-500" /> {post.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-purple-500" /> {post.readTime}
                                </span>
                            </div>

                            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors leading-snug" style={{ fontFamily: "var(--font-heading)" }}>
                                {post.title}
                            </h2>

                            <p className="text-sm text-gray-600 leading-relaxed mb-6 flex-1">
                                {post.excerpt}
                            </p>

                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-gray-400" /> {post.author}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
}

export default Blog;
