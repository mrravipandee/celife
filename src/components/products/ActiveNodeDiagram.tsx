import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActiveNodeDiagramProps {
  productName?: string;
  actives?: Array<{ name: string; marker: string }>;
  targetSystem?: string;
  targetComponents?: string[];
  supportStatements?: string[];
  className?: string;
}

export function ActiveNodeDiagram({
  productName = "Nervify Forte",
  actives = [
    { name: "Methylcobalamin", marker: "Co-enzyme B12 (98%)" },
    { name: "Alpha Lipoic Acid", marker: "Standardised 99%" },
    { name: "Benfotiamine", marker: "Lipid-Soluble B1" },
    { name: "Pyridoxal-5-Phosphate", marker: "Bio-Active B6" },
  ],
  targetSystem = "Neuro-Cellular Matrix",
  targetComponents = [
    "Peripheral Myelin Integrity",
    "Micro-Neural Transmission",
    "Cellular ATP Generation",
  ],
  supportStatements = [
    "Supports peripheral nervous system structure and myelin maintenance.",
    "Promotes cellular energy production and mitochondrial resilience.",
    "Aids balanced neuro-muscular signaling and normal sensory transmission.",
    "Provides targeted intracellular antioxidant defense against oxidative fatigue.",
  ],
  className,
}: ActiveNodeDiagramProps) {
  return (
    <div className={cn("w-full border border-[var(--line)] rounded-[6px] bg-[var(--paper)] p-6 sm:p-8 lg:p-10", className)}>
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
          <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
            Physiological Rationale & Target Architecture
          </span>
        </div>
        <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)] tracking-tight">
          Actives to Physiological Target Mapping
        </h3>
        <p className="text-xs sm:text-sm font-sans text-[var(--sage)] leading-relaxed max-w-[65ch]">
          Geometric representation of {productName} calibrated actives interacting with targeted cellular pathways.
        </p>
      </div>

      {/* Schematic Node Diagram */}
      <div className="border border-[var(--line)] rounded-[6px] p-6 bg-[var(--bone)]/30 mb-8 overflow-x-auto">
        <div className="min-w-[640px] grid grid-cols-12 gap-4 items-center">
          {/* Column 1: Calibrated Actives */}
          <div className="col-span-4 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-[var(--forest)] pb-1 border-b border-[var(--line)]">
              Calibrated Actives
            </div>
            {actives.map((act, i) => (
              <div
                key={i}
                className="bg-[var(--paper)] border border-[var(--line)] rounded-[4px] p-3 text-xs shadow-xs"
              >
                <div className="font-semibold text-[var(--ink)]">{act.name}</div>
                <div className="text-[11px] text-[var(--sage)] tabular-nums">{act.marker}</div>
              </div>
            ))}
          </div>

          {/* Column 2: Vector Node Connectors */}
          <div className="col-span-4 flex flex-col items-center justify-center px-2 py-4">
            <svg
              viewBox="0 0 160 220"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-44 text-[var(--line)]"
            >
              {/* Convergence lines */}
              <path d="M 0 35 C 70 35, 90 110, 160 110" stroke="var(--sage)" strokeWidth="1.25" strokeDasharray="3 3" />
              <path d="M 0 85 C 60 85, 90 110, 160 110" stroke="var(--sage)" strokeWidth="1.25" />
              <path d="M 0 135 C 60 135, 90 110, 160 110" stroke="var(--sage)" strokeWidth="1.25" />
              <path d="M 0 185 C 70 185, 90 110, 160 110" stroke="var(--sage)" strokeWidth="1.25" strokeDasharray="3 3" />

              {/* Central node circle */}
              <circle cx="160" cy="110" r="4" fill="var(--forest)" />
            </svg>
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[var(--sage)] bg-[var(--paper)] border border-[var(--line)] px-2 py-0.5 rounded-[3px]">
              Bioactive Synergy
            </span>
          </div>

          {/* Column 3: Target System */}
          <div className="col-span-4 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.16em] font-bold text-[var(--forest)] pb-1 border-b border-[var(--line)]">
              Targeted Physiological System
            </div>
            <div className="bg-[var(--paper)] border-2 border-[var(--forest)]/40 rounded-[4px] p-3.5 space-y-2">
              <div className="text-xs font-bold text-[var(--forest)] uppercase tracking-wide">
                {targetSystem}
              </div>
              <ul className="space-y-1.5 pt-1 border-t border-[var(--line)]">
                {targetComponents.map((comp, idx) => (
                  <li key={idx} className="text-[11px] text-[var(--ink)] flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-[var(--forest)]" />
                    <span>{comp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Structure & Function Statements */}
      <div className="space-y-2.5 pt-2">
        <h4 className="text-[11px] uppercase tracking-[0.16em] font-bold text-[var(--forest)]">
          Documented Physiological Support Statements
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {supportStatements.map((stmt, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2.5 text-xs sm:text-sm font-sans text-[var(--ink)]/85 bg-[var(--bone)]/40 border border-[var(--line)] p-3 rounded-[4px]"
            >
              <Check size={16} strokeWidth={2} className="text-[var(--forest)] shrink-0 mt-0.5" />
              <span className="leading-relaxed">{stmt}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
