import { Link } from "react-router-dom";
import { Mail, ArrowRight, Gift } from "lucide-react";
import toast from "react-hot-toast";

const LINKS = {
    Company: [
        { name: "About Us", path: "/about" },
        { name: "Careers", path: "/careers" },
        { name: "Blog", path: "/blog" },
        { name: "Press Kit", path: "/press" },
        { name: "Contact", path: "/contact" },
    ],
    Support: [
        { name: "Help Center", path: "/help" },
        { name: "Returns", path: "/returns" },
        { name: "Track Order", path: "/track-order" },
        { name: "Bulk Orders", path: "/bulk-orders" },
    ],
    Legal: [
        { name: "Privacy Policy", path: "/privacy" },
        { name: "Terms & Conditions", path: "/terms" },
        { name: "Cookie Policy", path: "/cookies" },
        { name: "Refund Policy", path: "/refund" },
    ],
};

const SOCIALS = [
    { label: "Facebook", href: "#", icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    )},
    { label: "Instagram", href: "#", icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    )},
    { label: "Twitter / X", href: "#", icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )},
    { label: "LinkedIn", href: "#", icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect x="2" y="9" width="4" height="12" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    )},
];

function Footer() {
    return (
        <footer className="bg-slate-900 border-t border-slate-800 mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">

                {/* ── Main Footer Links ───────────── */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-12 gap-x-8 mb-16">
                    
                    {/* Brand Column */}
                    <div className="col-span-2 lg:col-span-2 pr-8">
                        <Link to="/" className="inline-block mb-6">
                            <span className="text-3xl font-black tracking-tight text-white font-sans">
                                BAZARIO<span className="text-purple-500">.</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
                            Curated collections of premium tech, fashion, and lifestyle essentials. Designed for the modern professional.
                        </p>
                        <div className="flex items-center gap-4">
                            {SOCIALS.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    title={social.label}
                                    className="p-2.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(LINKS).map(([title, links]) => (
                        <div key={title} className="col-span-1">
                            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-6">
                                {title}
                            </h4>
                            <ul className="space-y-4">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link
                                            to={link.path}
                                            className="text-slate-400 text-sm font-medium hover:text-white transition"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ── Footer Bottom ───────────────── */}
                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-slate-500 text-sm font-medium">
                        © {new Date().getFullYear()} Bazario Inc. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
                        <span>United States (USD)</span>
                    </div>
                </div>

            </div>
        </footer>
    );
}

export default Footer;