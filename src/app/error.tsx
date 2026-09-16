"use client";

import React, { useEffect } from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error("Root error boundary caught exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#F8FAF6] flex flex-col items-center justify-center p-6 text-center space-y-6 text-[#171B18]">
      <div className="w-12 h-12 rounded-full bg-[#ED1C24]/10 flex items-center justify-center text-[#ED1C24] font-bold text-lg mb-2">
        !
      </div>
      <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
        Notice
      </span>
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#171B18] max-w-xl leading-tight">
        Something went wrong.
      </h1>
      <p className="text-sm text-[#52635A] max-w-md leading-relaxed font-sans">
        We encountered an error processing your request. Please try again or return to the homepage if the problem persists.
      </p>
      <div className="pt-4 flex items-center gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#123C2D] text-white text-xs uppercase tracking-[0.16em] font-semibold rounded-xs hover:bg-[#1B4D3B] transition-colors cursor-pointer"
        >
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-3 border border-[#123C2D]/20 text-[#123C2D] text-xs uppercase tracking-[0.16em] font-semibold rounded-xs hover:bg-[#123C2D]/5 transition-colors cursor-pointer"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
