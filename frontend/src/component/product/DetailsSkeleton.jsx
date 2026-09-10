import React from "react";

export default function DetailsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 animate-pulse">
            
            {/* Breadcrumb Skeleton */}
            <div className="flex items-center gap-2 mb-8">
                <div className="w-16 h-3 bg-slate-200 rounded-full" />
                <div className="w-4 h-3 bg-slate-100 rounded-full" />
                <div className="w-20 h-3 bg-slate-200 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                
                {/* Images Skeleton */}
                <div className="space-y-4">
                    {/* Main Image */}
                    <div className="aspect-[4/5] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 relative">
                        <div className="absolute inset-0 bg-slate-200" />
                    </div>
                    
                    {/* Thumbnail Images */}
                    <div className="grid grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="aspect-square bg-slate-100 rounded-2xl border border-slate-200" />
                        ))}
                    </div>
                </div>

                {/* Details Skeleton */}
                <div>
                    {/* Badges */}
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-20 h-6 bg-slate-200 rounded-full" />
                        <div className="w-24 h-6 bg-slate-100 rounded-full" />
                    </div>

                    {/* Title & Brand */}
                    <div className="w-32 h-4 bg-slate-200 rounded-full mb-4" />
                    <div className="w-full h-10 bg-slate-200 rounded-xl mb-4" />
                    <div className="w-3/4 h-10 bg-slate-200 rounded-xl mb-6" />

                    {/* Ratings */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-32 h-5 bg-slate-100 rounded-lg" />
                    </div>

                    {/* Price */}
                    <div className="py-6 border-y border-slate-100 mb-8">
                        <div className="flex items-end gap-4">
                            <div className="w-32 h-10 bg-slate-200 rounded-xl" />
                            <div className="w-16 h-5 bg-slate-100 rounded-lg mb-1" />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3 mb-10">
                        <div className="w-full h-4 bg-slate-100 rounded-full" />
                        <div className="w-full h-4 bg-slate-100 rounded-full" />
                        <div className="w-5/6 h-4 bg-slate-100 rounded-full" />
                        <div className="w-4/6 h-4 bg-slate-100 rounded-full" />
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex-1 h-14 bg-slate-200 rounded-2xl" />
                        <div className="w-full sm:w-16 h-14 bg-slate-100 rounded-2xl" />
                    </div>
                    
                    {/* Meta Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100" />
                        <div className="h-16 bg-slate-50 rounded-2xl border border-slate-100" />
                    </div>
                </div>
            </div>
        </div>
    );
}
