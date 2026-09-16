import React from "react";
import { cn } from "@/lib/utils";

interface BotanicalMandalaProps {
  className?: string;
  size?: number;
}

export function BotanicalMandala({ className }: BotanicalMandalaProps) {
  return (
    <svg
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
      aria-hidden="true"
      suppressHydrationWarning
    >
      {/* Outer Fine Calibration & Sacred Geometry Rings */}
      <circle
        cx="200"
        cy="200"
        r="185"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="2 4"
        opacity="0.6"
      />
      <circle
        cx="200"
        cy="200"
        r="176"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <circle
        cx="200"
        cy="200"
        r="150"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* 12 Outer Lotus & Botanical Petals */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`outer-petal-${i}`} transform={`rotate(${i * 30} 200 200)`}>
          {/* Main Leaf Petal Contour */}
          <path
            d="M 200 18 C 220 58, 238 112, 200 152 C 162 112, 180 58, 200 18 Z"
            stroke="currentColor"
            strokeWidth="1.2"
            fill="currentColor"
            fillOpacity="0.04"
          />
          {/* Central Stem Line */}
          <path
            d="M 200 32 L 200 142"
            stroke="currentColor"
            strokeWidth="0.8"
            strokeDasharray="2 3"
            opacity="0.7"
          />
          {/* Flanking Secondary Vein Loop */}
          <path
            d="M 200 75 C 218 90, 226 112, 200 128 C 174 112, 182 90, 200 75"
            stroke="currentColor"
            strokeWidth="0.75"
            opacity="0.8"
          />
          {/* Tip Stamen / Seed Accent */}
          <circle cx="200" cy="15" r="2.5" fill="currentColor" opacity="0.8" />
          <circle cx="200" cy="15" r="5" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
        </g>
      ))}

      {/* Interstitial Star Diamond Accents */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`accent-${i}`} transform={`rotate(${i * 30 + 15} 200 200)`}>
          <line
            x1="200"
            y1="152"
            x2="200"
            y2="175"
            stroke="currentColor"
            strokeWidth="0.8"
            opacity="0.5"
          />
          <circle cx="200" cy="175" r="1.5" fill="currentColor" opacity="0.7" />
        </g>
      ))}

      {/* Middle Concentric Ring with Fine Beaded Stamen Dots */}
      <circle
        cx="200"
        cy="200"
        r="110"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.6"
      />
      {Array.from({ length: 24 }).map((_, i) => (
        <circle
          key={`bead-${i}`}
          cx="200"
          cy="90"
          r="1.5"
          fill="currentColor"
          opacity="0.75"
          transform={`rotate(${i * 15} 200 200)`}
        />
      ))}

      {/* 12 Inner Botanical Petals (Interleaved at 15° Offset) */}
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`inner-petal-${i}`} transform={`rotate(${i * 30 + 15} 200 200)`}>
          <path
            d="M 200 85 C 216 112, 222 142, 200 165 C 178 142, 184 112, 200 85 Z"
            stroke="currentColor"
            strokeWidth="1"
            fill="currentColor"
            fillOpacity="0.05"
          />
          <circle cx="200" cy="80" r="1.5" fill="currentColor" opacity="0.8" />
        </g>
      ))}

      {/* Central Heart of Mandala: Concentric Geometric Rosette */}
      <circle
        cx="200"
        cy="200"
        r="55"
        stroke="currentColor"
        strokeWidth="1"
        strokeDasharray="3 3"
        opacity="0.6"
      />
      <circle
        cx="200"
        cy="200"
        r="40"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.8"
      />

      {/* 8 Inner Core Petals */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`core-${i}`} transform={`rotate(${i * 45} 200 200)`}>
          <path
            d="M 200 162 C 208 174, 212 186, 200 196 C 188 186, 192 174, 200 162 Z"
            stroke="currentColor"
            strokeWidth="0.8"
            fill="currentColor"
            fillOpacity="0.1"
          />
        </g>
      ))}

      {/* Nucleus / Center Bindu */}
      <circle
        cx="200"
        cy="200"
        r="14"
        stroke="currentColor"
        strokeWidth="1"
        fill="currentColor"
        fillOpacity="0.08"
      />
      <circle cx="200" cy="200" r="4.5" fill="currentColor" opacity="0.9" />
    </svg>
  );
}
