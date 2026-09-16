"use client";

import React from "react";
import { ShieldCheck, Award, Microscope, CheckCircle2 } from "lucide-react";

export function BotanicalSpecificationGraphic() {
  return (
    <div className="w-full max-w-[480px] bg-[#0A2219]/90 border border-white/15 rounded-[8px] p-6 sm:p-7 backdrop-blur-md shadow-2xl relative overflow-hidden group">
      {/* Background ambient radial glow */}
      <div
        className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 117, 96, 0.8) 0%, rgba(18, 60, 45, 0) 70%)",
        }}
      />
      <div
        className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full pointer-events-none opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(158, 176, 162, 0.6) 0%, rgba(18, 60, 45, 0) 70%)",
        }}
      />

      {/* Top Header Row with Technical Monospace Spec Data */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 text-[10px] font-mono tracking-[0.14em] uppercase text-white/60">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] animate-pulse" />
          <span className="text-[var(--clay-light,#C49A88)] font-sans font-semibold tracking-wider">
            SPEC NO. CLF-BIO-2026
          </span>
        </div>
        <div className="text-white/40 tabular-nums">STD · VERIFIED</div>
      </div>

      {/* Main Schematic Botanical Vector Area */}
      <div className="relative my-6 flex items-center justify-center">
        <svg
          viewBox="0 0 400 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full max-w-[360px] h-auto text-[var(--sage)]"
        >
          {/* Outer Technical Compass Ring */}
          <circle
            cx="200"
            cy="180"
            r="160"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="180"
            r="160"
            stroke="rgba(168,117,96,0.3)"
            strokeWidth="1"
            strokeDasharray="4 8"
          />

          {/* Secondary Concentric Calibration Ring */}
          <circle
            cx="200"
            cy="180"
            r="135"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />

          {/* Degree Calibration Marks */}
          <line x1="200" y1="12" x2="200" y2="28" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <line x1="200" y1="332" x2="200" y2="348" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <line x1="32" y1="180" x2="48" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
          <line x1="352" y1="180" x2="368" y2="180" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />

          {/* Corner Crosshairs */}
          <path d="M 45 45 L 45 60 M 45 45 L 60 45" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M 355 45 L 355 60 M 355 45 L 340 45" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M 45 315 L 45 300 M 45 315 L 60 315" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <path d="M 355 315 L 355 300 M 355 315 L 340 315" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Inner Hexagonal Molecular Lattice */}
          <polygon
            points="200,95 273,137 273,222 200,265 127,222 127,137"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
            strokeDasharray="3 3"
          />

          {/* Botanical Central Stem (Fluid S-Curve) */}
          <path
            d="M 200 310 C 196 260, 204 140, 200 65"
            stroke="rgba(212, 175, 120, 0.85)"
            strokeWidth="1.75"
            strokeLinecap="round"
          />

          {/* Botanical Leaf Pair 1 (Bottom) */}
          <path
            d="M 200 245 C 255 235, 290 200, 305 145 C 275 168, 235 205, 200 215"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.25"
            strokeLinecap="round"
            fill="rgba(158,176,162,0.06)"
          />
          {/* Leaf 1 internal venation */}
          <path d="M 220 226 C 248 210, 275 185, 290 160" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <path d="M 235 218 C 258 206, 276 192, 285 180" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />

          {/* Botanical Leaf Pair 1 (Left counterpart) */}
          <path
            d="M 200 225 C 145 215, 110 180, 95 125 C 125 148, 165 185, 200 195"
            stroke="rgba(255,255,255,0.7)"
            strokeWidth="1.25"
            strokeLinecap="round"
            fill="rgba(158,176,162,0.06)"
          />
          {/* Leaf 2 internal venation */}
          <path d="M 180 206 C 152 190, 125 165, 110 140" stroke="rgba(255,255,255,0.25)" strokeWidth="1" />
          <path d="M 165 198 C 142 186, 124 172, 115 160" stroke="rgba(255,255,255,0.2)" strokeWidth="0.75" />

          {/* Botanical Leaf Pair 2 (Higher) */}
          <path
            d="M 200 160 C 240 148, 268 120, 278 85 C 252 102, 222 130, 200 138"
            stroke="rgba(212,175,120,0.8)"
            strokeWidth="1.25"
            strokeLinecap="round"
            fill="rgba(212,175,120,0.06)"
          />
          <path
            d="M 200 145 C 160 133, 132 105, 122 70 C 148 87, 178 115, 200 123"
            stroke="rgba(212,175,120,0.8)"
            strokeWidth="1.25"
            strokeLinecap="round"
            fill="rgba(212,175,120,0.06)"
          />

          {/* Apex Terminal Bud */}
          <path
            d="M 200 85 C 215 70, 215 48, 200 32 C 185 48, 185 70, 200 85 Z"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="1.25"
            fill="rgba(255,255,255,0.12)"
          />

          {/* Bioactive Node Coordinates */}
          <circle cx="305" cy="145" r="4" fill="var(--clay)" />
          <circle cx="305" cy="145" r="7" stroke="rgba(168,117,96,0.4)" strokeWidth="1" />
          
          <circle cx="95" cy="125" r="4" fill="var(--clay)" />
          <circle cx="95" cy="125" r="7" stroke="rgba(168,117,96,0.4)" strokeWidth="1" />

          <circle cx="278" cy="85" r="3.5" fill="rgba(212,175,120,0.9)" />
          <circle cx="122" cy="70" r="3.5" fill="rgba(212,175,120,0.9)" />

          <circle cx="200" cy="32" r="3" fill="#FFFFFF" />

          {/* Center Coordinate Target Ring */}
          <circle cx="200" cy="180" r="18" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <circle cx="200" cy="180" r="3" fill="#FFFFFF" />
          <line x1="175" y1="180" x2="225" y2="180" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
          <line x1="200" y1="155" x2="200" y2="205" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

          {/* Annotation Labels in SVG */}
          <text x="316" y="149" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">
            BIOACTIVE MARKERS
          </text>
          <text x="32" y="129" fill="rgba(255,255,255,0.75)" fontSize="9" fontFamily="monospace" letterSpacing="0.08em">
            PURITY SPECTRUM
          </text>
        </svg>
      </div>

      {/* Technical Spec Matrix (2x2 Grid) */}
      <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
        <div className="p-2.5 rounded-[4px] bg-white/[0.04] border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-white/50">
            <Microscope size={12} className="text-[var(--clay)]" />
            <span>Extraction</span>
          </div>
          <div className="font-semibold text-white tracking-wide text-[12px]">
            10:1 Standardized
          </div>
          <div className="text-[10px] text-white/60">Verified Bioactives</div>
        </div>

        <div className="p-2.5 rounded-[4px] bg-white/[0.04] border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-white/50">
            <ShieldCheck size={12} className="text-[var(--sage)]" />
            <span>Excipients</span>
          </div>
          <div className="font-semibold text-white tracking-wide text-[12px]">
            Zero GMO Fillers
          </div>
          <div className="text-[10px] text-white/60">Clean Matrix Core</div>
        </div>

        <div className="p-2.5 rounded-[4px] bg-white/[0.04] border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-white/50">
            <Award size={12} className="text-[var(--clay)]" />
            <span>Assay Quality</span>
          </div>
          <div className="font-semibold text-white tracking-wide text-[12px]">
            HPLC Validated
          </div>
          <div className="text-[10px] text-white/60">Batch-Level CoA</div>
        </div>

        <div className="p-2.5 rounded-[4px] bg-white/[0.04] border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-wider text-white/50">
            <CheckCircle2 size={12} className="text-[var(--sage)]" />
            <span>Purity Standard</span>
          </div>
          <div className="font-semibold text-white tracking-wide text-[12px]">
            ICP-MS Screened
          </div>
          <div className="text-[10px] text-white/60">&lt; 0.001 PPM Metals</div>
        </div>
      </div>

      {/* Subtle Bottom Watermark Tag */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-white/40 tracking-wider">
        <span>ARCHITECTURAL BOTANICAL MATRIX</span>
        <span>MUMBAI · MH · IN</span>
      </div>
    </div>
  );
}
