"use client";

import React from "react";
import { Download } from "lucide-react";

export function InquiryHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E1E8E2] pb-6 select-none">
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#123C2D] font-sans font-semibold block">
          CELIFE CMS / ENQUIRIES
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#17201B] tracking-tight">
          Client & B2B Enquiries
        </h2>
        <p className="text-xs text-[#68756D] font-sans mt-0.5">
          Manage healthcare consultations, bulk order quotes, and partner enquiries.
        </p>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium bg-white border border-[#E1E8E2] text-[#17201B] hover:bg-[#F0F4F0] transition-colors rounded-md shadow-xs cursor-pointer"
        >
          <Download size={14} className="text-[#68756D]" />
          <span>Export Enquiries</span>
        </button>
      </div>
    </div>
  );
}
