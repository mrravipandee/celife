"use client";

import React from "react";
import { Plus } from "lucide-react";

interface CaseStudyHeaderProps {
  onNewCaseStudyClick: () => void;
}

export function CaseStudyHeader({ onNewCaseStudyClick }: CaseStudyHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6 select-none">
      <div className="space-y-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-sans">
          THEDCO / CONTENT
        </span>
        <h2 className="text-2xl md:text-3xl font-serif text-white tracking-wide">
          Case Studies
        </h2>
        <p className="text-xs text-white/50 font-sans tracking-wide">
          Showcase hospitality projects, challenges, strategic interventions and business outcomes.
        </p>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={onNewCaseStudyClick}
          className="flex items-center gap-2 px-5 py-2.5 text-[10px] uppercase tracking-[0.2em] font-sans bg-transparent border border-white/10 text-white hover:border-primary hover:text-primary transition-all duration-350 cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-primary/50 rounded-xs"
        >
          <Plus size={12} />
          <span>New Case Study</span>
        </button>
      </div>
    </div>
  );
}
