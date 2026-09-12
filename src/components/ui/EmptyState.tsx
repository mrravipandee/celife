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
    <div className="flex flex-col items-center justify-center p-12 md:p-20 bg-[#050505] border border-white/5 rounded-xs space-y-5 select-none text-center">
      <div className="space-y-1">
        <h4 className="text-xs uppercase tracking-[0.2em] text-white/65 font-sans font-semibold">
          {title}
        </h4>
        <p className="text-sm text-white/55 font-sans tracking-wide">
          {description}
        </p>
      </div>

      {/* Small gold line detail */}
      <div className="w-8 h-[1px] bg-primary" />

      {/* Action button if applicable */}
      {actionText && onAction && (
        <div className="pt-2">
          <button
            type="button"
            onClick={onAction}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary text-black hover:bg-white hover:text-black transition-all duration-300 text-xs uppercase tracking-wider font-sans font-semibold rounded-xs outline-none cursor-pointer"
          >
            {actionIcon || <Plus size={10} />}
            <span>{actionText}</span>
          </button>
        </div>
      )}
    </div>
  );
}
