import React from "react";

export default function ProductSkeleton() {
    return (
        <div className="group relative block bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm animate-pulse">
            {/* Image Skeleton */}
            <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 bg-slate-200" />
            </div>

            {/* Content Skeleton */}
            <div className="p-5 sm:p-6 pb-20">
                {/* Brand Skeleton */}
                <div className="w-16 h-3 bg-slate-100 rounded-full mb-3" />
                
                {/* Title Skeleton */}
                <div className="w-3/4 h-5 bg-slate-200 rounded-lg mb-2" />
                <div className="w-1/2 h-5 bg-slate-200 rounded-lg mb-4" />
                
                {/* Rating Skeleton */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-20 h-4 bg-slate-100 rounded-lg" />
                </div>
            </div>

            {/* Footer / Button Skeleton */}
            <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between gap-3 pt-4 border-t border-slate-50 bg-white">
                <div>
                    <div className="w-20 h-5 bg-slate-200 rounded-lg mb-1" />
                    <div className="w-12 h-3 bg-slate-100 rounded-full" />
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-full shrink-0" />
            </div>
        </div>
    );
}
