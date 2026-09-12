"use client";

import React from "react";

export function BlogEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-[#050505] border border-white/5 rounded-xs space-y-4 select-none text-center">
      <div className="space-y-1">
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-sans font-semibold">
          No Articles Yet
        </h4>
        <p className="text-xs text-white/30 font-sans tracking-wide">
          Create your first THEDCO insight or hospitality article.
        </p>
      </div>
      {/* Small gold divider */}
      <div className="w-6 h-[1px] bg-primary mt-2" />
    </div>
  );
}
