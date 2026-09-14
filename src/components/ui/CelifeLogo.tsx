import React from "react";
import { cn } from "@/lib/utils";

interface CelifeLogoProps {
  className?: string;
  variant?: "dark" | "light";
  showTagline?: boolean;
}

export function CelifeLogo({
  className,
  variant = "dark",
  showTagline = true,
}: CelifeLogoProps) {
  const isDark = variant === "dark";

  return (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {/* Brand Icon Mark: Minimalist botanical leaf emblem with red core accent */}
      <div className="relative w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center shrink-0">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
          aria-hidden="true"
        >
          {/* Outer botanical curve in forest green */}
          <path
            d="M18 3C18 3 7 9 7 20C7 26.6274 12.3726 32 19 32C25.6274 32 31 26.6274 31 20C31 9 20 3 20 3"
            stroke={isDark ? "#123C2D" : "#E6EFEB"}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner vascular stem */}
          <path
            d="M18 10V27M18 16L23 13M18 21L13 18"
            stroke={isDark ? "#294F3D" : "#C4D5C7"}
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          {/* Signature Celife Red Accent Core */}
          <circle cx="18" cy="8" r="2.8" fill="#ED1C24" />
        </svg>
      </div>

      {/* Brand Text */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center tracking-[0.14em] font-sans font-extrabold text-lg sm:text-xl">
          <span className={isDark ? "text-[#171B18]" : "text-white"}>CEL</span>
          <span className="text-[#ED1C24]">I</span>
          <span className={isDark ? "text-[#171B18]" : "text-white"}>FE</span>
        </div>
        {showTagline && (
          <span
            className={cn(
              "text-[9px] uppercase tracking-[0.28em] font-sans font-medium mt-0.5",
              isDark ? "text-[#52635A]" : "text-white/70"
            )}
          >
            Health Solutions
          </span>
        )}
      </div>
    </div>
  );
}
