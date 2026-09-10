import React from "react";

export default function LogoLoader() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
            <div className="flex items-end gap-1">
                <span className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 font-sans animate-pulse">
                    BAZARIO
                </span>
                <div className="w-2 h-2 md:w-2.5 md:h-2.5 bg-purple-600 rounded-full mb-1 md:mb-1.5 animate-bounce" style={{ animationDelay: "0.1s", animationDuration: "1s" }}></div>
            </div>
            <div className="mt-5 flex items-center justify-center gap-1.5">
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-1 h-1 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
        </div>
    );
}
