import React from "react";
import { cn } from "@/lib/utils";

interface BotanicalArtProps {
  variant?: "leaf" | "root" | "seed-pod";
  className?: string;
}

export function BotanicalArt({
  variant = "leaf",
  className,
}: BotanicalArtProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute select-none text-[var(--sage)] opacity-12",
        className
      )}
    >
      {variant === "leaf" && (
        <svg
          viewBox="0 0 400 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Main botanical stem */}
          <path
            d="M200 580 C190 440, 210 260, 200 40"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          {/* Leaf pair 1 */}
          <path
            d="M200 450 C280 430, 340 370, 360 290 C320 330, 260 380, 200 400"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M200 400 C120 380, 60 320, 40 240 C80 280, 140 330, 200 350"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          {/* Leaf pair 2 */}
          <path
            d="M200 300 C270 280, 320 220, 330 160 C300 200, 250 240, 200 260"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M200 250 C130 230, 80 170, 70 110 C100 150, 150 190, 200 210"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          {/* Terminal tip */}
          <path
            d="M200 120 C230 90, 230 50, 200 20 C170 50, 170 90, 200 120"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      )}

      {variant === "root" && (
        <svg
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <path
            d="M250 20 C240 120, 270 220, 250 320 C240 380, 230 440, 220 480"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M255 180 C320 220, 390 260, 440 330"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M330 225 C370 280, 400 350, 420 420"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M245 220 C180 260, 110 300, 60 370"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
          <path
            d="M170 265 C130 320, 100 390, 80 460"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
          />
        </svg>
      )}

      {variant === "seed-pod" && (
        <svg
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <ellipse
            cx="200"
            cy="200"
            rx="120"
            ry="160"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <ellipse
            cx="200"
            cy="200"
            rx="70"
            ry="130"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <line
            x1="200"
            y1="40"
            x2="200"
            y2="360"
            stroke="currentColor"
            strokeWidth="1.25"
          />
          <circle cx="200" cy="130" r="14" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="200" cy="200" r="16" stroke="currentColor" strokeWidth="1.25" />
          <circle cx="200" cy="270" r="14" stroke="currentColor" strokeWidth="1.25" />
        </svg>
      )}
    </div>
  );
}
