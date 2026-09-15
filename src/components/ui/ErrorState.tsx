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
    <div className="flex flex-col items-center justify-center p-10 bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs space-y-5 select-none text-center max-w-md mx-auto my-12 shadow-2xs">
      <div className="space-y-1.5">
        <h4 className="text-xs uppercase tracking-[0.16em] text-[#C0392B] font-sans font-bold">
          {title}
        </h4>
        <p className="text-xs text-[#68756D] font-sans leading-relaxed">
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
              className={`px-5 py-2 text-xs uppercase tracking-wider font-sans font-semibold transition-all duration-150 rounded-xs outline-none cursor-pointer ${
                retryVariant === "solid"
                  ? "bg-[#123C2D] text-white hover:bg-[#294F3D]"
                  : "bg-transparent border border-[#E1E8E2] text-[#17201B] hover:border-[#123C2D] hover:text-[#123C2D]"
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
