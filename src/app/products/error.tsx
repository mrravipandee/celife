"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, ArrowLeft } from "lucide-react";

export default function ProductsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error internally if monitoring is set up
    console.error("Products error boundary caught:", error);
  }, [error]);

  return (
    <div className="bg-slate-50/50 min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-10 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-5">
          <AlertCircle className="w-7 h-7 stroke-[1.5]" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
          Unable to Load Portfolio
        </h2>

        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          We encountered an unexpected issue while retrieving formulation records. Please try reloading or return to the homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-teal-800 text-white font-medium text-sm hover:bg-teal-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-700"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
