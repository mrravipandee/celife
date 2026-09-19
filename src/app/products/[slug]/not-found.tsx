import React from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="bg-slate-50/50 min-h-[70vh] flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center bg-white rounded-2xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6 text-slate-500">
          <Search className="w-8 h-8 stroke-[1.5]" />
        </div>

        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 uppercase tracking-widest mb-3">
          404 Error
        </span>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          Formulation Not Found
        </h1>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
          The requested formulation could not be found or is currently not available in our active public portfolio. Please verify the URL or explore our complete catalogue.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-teal-800 text-white font-medium text-sm hover:bg-teal-900 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-700 focus:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            View Product Portfolio
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm hover:bg-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
          >
            Contact Celife
          </Link>
        </div>
      </div>
    </div>
  );
}
