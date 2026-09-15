"use client";

import React from "react";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  actionIcon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  actionIcon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-10 md:p-14 bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs space-y-4 select-none text-center shadow-2xs">
      <div className="space-y-1">
        <h4 className="text-xs uppercase tracking-[0.14em] text-[#17201B] font-sans font-bold">
          {title}
        </h4>
        <p className="text-xs text-[#68756D] font-sans max-w-sm">
          {description}
        </p>
      </div>

      {/* Small green line detail */}
      <div className="w-8 h-[2px] bg-[#123C2D]/30 rounded-full" />

      {/* Action button if applicable */}
      {actionText && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-2 px-4 py-2 bg-[#123C2D] text-white hover:bg-[#294F3D] transition-all duration-150 text-xs uppercase tracking-wider font-sans font-semibold rounded-xs outline-none cursor-pointer shadow-xs"
          >
            {actionIcon || <Plus size={12} />}
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
}
