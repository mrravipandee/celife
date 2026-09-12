"use client";

import React from "react";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  retryVariant?: "solid" | "outline";
  children?: React.ReactNode;
}

export function ErrorState({
  title = "Unable to load data",
  description = "A database error or connection issue occurred. Please check your network and try again.",
  onRetry,
  retryText = "Try Again",
  retryVariant = "outline",
  children,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-[#050505] border border-white/5 rounded-xs space-y-6 select-none text-center max-w-lg mx-auto mt-20">
      <div className="space-y-2">
        <h4 className="text-sm uppercase tracking-[0.2em] text-red-400 font-sans font-semibold">
          {title}
        </h4>
        <p className="text-sm text-white/60 font-sans leading-relaxed">
          {description}
        </p>
      </div>
      {(onRetry || children) && (
        <div className="flex items-center gap-3 select-none justify-center">
          {children}
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className={`px-5 py-2.5 text-xs uppercase tracking-[0.15em] font-sans font-semibold transition-all duration-300 rounded-xs outline-none cursor-pointer ${
                retryVariant === "solid"
                  ? "bg-primary text-black hover:bg-white hover:text-black"
                  : "bg-transparent border border-white/10 text-white hover:border-primary hover:text-primary"
              }`}
            >
              {retryText}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
