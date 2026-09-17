"use client";

import React from "react";
import { Leaf, Loader2 } from "lucide-react";

interface LoaderProps {
  variant?: "fullscreen" | "inline";
  text?: string;
}

export function Loader({
  variant = "fullscreen",
  text = "Formulating your wellness experience..."
}: LoaderProps) {

  // Base wrapper for inline vs fullscreen
  const wrapperClasses = variant === "fullscreen"
    ? "fixed inset-0 z-[9999] bg-[#FDFDFD] flex flex-col items-center justify-center"
    : "w-full py-20 flex flex-col items-center justify-center";

  return (
    <div className={`${wrapperClasses} select-none transition-all duration-500 ease-in-out`}>
      {/* Premium Background Texture (Subtle) */}
      {variant === "fullscreen" && (
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0F4F0] to-[#FFFFFF] opacity-50 pointer-events-none" />
      )}

      <div className="relative flex flex-col items-center z-10 space-y-8">

        {/* Botanical Animated Spinner */}
        <div className="relative flex items-center justify-center w-24 h-24">
          {/* Outer subtle ring */}
          <div className="absolute inset-0 border border-[#E1E8E2] rounded-full" />

          {/* Inner spinning brand ring */}
          <div className="absolute inset-2 border-2 border-[#123C2D] border-t-transparent rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />

          {/* Center Leaf Icon with breathing animation */}
          <div className="relative flex items-center justify-center w-12 h-12 bg-[#F0F4F0] rounded-full shadow-inner animate-pulse">
            <Leaf className="w-6 h-6 text-[#123C2D]" />
          </div>
        </div>

        {/* Typography */}
        <div className="flex flex-col items-center space-y-3 text-center px-4">
          <h2 className="text-2xl font-serif tracking-wide text-[#123C2D]">
            Celife Health Solutions
          </h2>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#68756D] font-sans font-medium">
            {text}
          </p>
        </div>
      </div>

      {/* Elegant Bottom Progress Bar (Only for fullscreen) */}
      {variant === "fullscreen" && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#E1E8E2] overflow-hidden">
          <div
            className="h-full bg-[#123C2D] w-1/3 animate-[shimmer_2s_infinite_ease-in-out]"
            style={{
              animation: 'progress 2s infinite ease-in-out'
            }}
          />
          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes progress {
              0% { transform: translateX(-100%); width: 20%; }
              50% { width: 40%; }
              100% { transform: translateX(300%); width: 20%; }
            }
          `}} />
        </div>
      )}
    </div>
  );
}