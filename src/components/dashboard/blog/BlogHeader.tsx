"use client";

import React from "react";
import { Plus } from "lucide-react";

interface BlogHeaderProps {
  onNewArticleClick: () => void;
}

export function BlogHeader({ onNewArticleClick }: BlogHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#E1E8E2] pb-6 select-none">
      <div className="space-y-1">
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#123C2D] font-sans font-semibold block">
          CELIFE CMS / EDITORIAL
        </span>
        <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#17201B] tracking-tight">
          Articles & Publications
        </h2>
        <p className="text-xs text-[#68756D] font-sans mt-0.5">
          Publish and manage healthcare research, wellness advisories, and nutraceutical insights.
        </p>
      </div>

      <div className="flex items-center">
        <button
          type="button"
          onClick={onNewArticleClick}
          className="flex items-center gap-2 px-4 py-2 text-xs font-sans font-medium bg-[#123C2D] hover:bg-[#294F3D] text-white transition-colors rounded-md shadow-xs cursor-pointer"
        >
          <Plus size={14} />
          <span>New Article</span>
        </button>
      </div>
    </div>
  );
}
