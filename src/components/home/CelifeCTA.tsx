import React from "react";
import Link from "next/link";
import { Send, ArrowRight } from "lucide-react";

export function CelifeCTA() {
  return (
    <section className="py-16 md:py-24 bg-[#123C2D] text-white relative overflow-hidden">
      {/* Subtle radial ambient background accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#81998D]/15 rounded-full blur-[120px]"
      />

      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/15 rounded-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24]" />
          <span className="text-[10px] uppercase tracking-[0.24em] font-sans font-semibold text-[#C4D5C7]">
            Product Enquiry & Distribution Desk
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight leading-[1.1]">
          Partner With Celife Health Solutions
        </h2>

        <p className="text-sm sm:text-base font-sans text-white/75 leading-relaxed max-w-2xl mx-auto">
          Whether you are a healthcare practitioner, pharmacy retailer, or institutional distributor — enquire today to request comprehensive formulation data sheets and availability.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/enquire"
            className="w-full sm:w-auto px-8 py-4 bg-white text-[#123C2D] hover:bg-[#F4F5EF] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs shadow-lg transition-all flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Submit Product Enquiry</span>
            <Send size={13} />
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-4 bg-transparent text-white border border-white/30 hover:border-white text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>View Full Catalogue</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </section>
  );
}
