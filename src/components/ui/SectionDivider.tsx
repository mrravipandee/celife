import React from "react";
import { cn } from "@/lib/utils";

interface SectionDividerProps {
  className?: string;
  variant?: "hairline" | "organic";
}

export function SectionDivider({
  className,
  variant = "hairline",
}: SectionDividerProps) {
  if (variant === "organic") {
    return (
      <div className={cn("w-full overflow-hidden flex items-center justify-center py-4", className)}>
        <svg
          viewBox="0 0 1200 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-[1380px] h-2 text-[var(--line)]"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 4C200 3.6 400 4.4 600 4C800 3.7 1000 4.3 1200 4"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12", className)}>
      <div className="w-full h-[1px] bg-[var(--line)]" aria-hidden="true" />
    </div>
  );
}
