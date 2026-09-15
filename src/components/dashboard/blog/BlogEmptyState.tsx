"use client";

import React from "react";

export function BlogEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-16 bg-white border border-[#E1E8E2] rounded-lg space-y-4 select-none text-center shadow-xs">
      <div className="space-y-1">
        <h4 className="text-sm font-serif font-bold text-[#17201B]">
          No Articles Published Yet
        </h4>
        <p className="text-xs text-[#68756D] font-sans">
          Create and publish healthcare insights, botanical research, or wellness articles.
        </p>
      </div>
      <div className="w-8 h-[2px] bg-[#123C2D] mt-2 rounded-full" />
    </div>
  );
}
