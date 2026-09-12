"use client";

import React from "react";
import { Plus, X } from "lucide-react";

interface ServiceEmptyStateProps {
  isFilterActive: boolean;
  onClearFilters: () => void;
  onNewService: () => void;
}

export function ServiceEmptyState({
  isFilterActive,
  onClearFilters,
  onNewService,
}: ServiceEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-[#050505] border border-white/5 rounded-xs space-y-5 select-none text-center">
      <div className="space-y-1">
        <h4 className="text-[10px] uppercase tracking-[0.25em] text-white/50 font-sans font-semibold">
          {isFilterActive ? "No Services Found" : "No Services Yet"}
        </h4>
        <p className="text-xs text-white/30 font-sans tracking-wide">
          {isFilterActive
            ? "Try adjusting your search or filters."
            : "Add your first THEDCO advisory service."}
        </p>
      </div>

      {/* Small gold line detail */}
      <div className="w-8 h-[1px] bg-primary" />

      {/* Action CTA triggers */}
      <div className="pt-2">
        {isFilterActive ? (
          <button
            type="button"
            onClick={onClearFilters}
            className="flex items-center gap-1.5 px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-black text-[9px] uppercase tracking-widest font-sans font-semibold rounded-xs transition-all duration-300 outline-none cursor-pointer"
          >
            <X size={10} />
            <span>Clear Filters</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onNewService}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-black hover:bg-white transition-all duration-300 text-[9px] uppercase tracking-widest font-sans font-semibold rounded-xs outline-none cursor-pointer"
          >
            <Plus size={10} />
            <span>New Service</span>
          </button>
        )}
      </div>
    </div>
  );
}
