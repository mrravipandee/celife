"use client";

import React from "react";
import { Download } from "lucide-react";

export function InquiryHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6 select-none">
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans">
          THEDCO / INQUIRIES
        </span>
        <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide">
          Inquiries
        </h2>
        <p className="text-xs text-white/50 font-sans tracking-wide">
          Manage consultation requests and business inquiries.
        </p>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          className="flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-sans bg-transparent border border-white/10 text-white hover:border-primary hover:text-primary transition-all duration-350 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xs"
        >
          <Download size={12} />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
