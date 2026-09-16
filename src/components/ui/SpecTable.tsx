import React from "react";
import { cn } from "@/lib/utils";

export interface SpecRow {
  label: string;
  value: string | React.ReactNode;
}

export interface SpecTableProps {
  caption?: string;
  rows: SpecRow[];
  className?: string;
}

export function SpecTable({ caption, rows, className }: SpecTableProps) {
  return (
    <div className={cn("w-full border border-[var(--line)] rounded-[6px] overflow-hidden bg-[var(--paper)]", className)}>
      <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
        {caption && (
          <caption className="sr-only">{caption}</caption>
        )}
        <tbody>
          {rows.map((row, idx) => (
            <tr
              key={idx}
              className={cn(
                "border-b border-[var(--line)] last:border-b-0 transition-colors",
                idx % 2 === 1 ? "bg-[var(--bone)]/40" : "bg-[var(--paper)]"
              )}
            >
              <th
                scope="row"
                className="py-3.5 px-4 sm:px-5 font-medium text-[var(--sage)] w-2/5 sm:w-1/3 border-r border-[var(--line)] uppercase text-[11px] tracking-[0.08em]"
              >
                {row.label}
              </th>
              <td className="py-3.5 px-4 sm:px-5 font-medium text-[var(--ink)] tabular-nums">
                {row.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export interface CompositionRow {
  ingredient: string;
  standardisedTo: string;
  quantity: string;
}

export interface CompositionTableProps {
  caption?: string;
  rows: CompositionRow[];
  footnote?: string;
  className?: string;
}

export function CompositionTable({
  caption = "Active Formulation Composition",
  rows,
  footnote,
  className,
}: CompositionTableProps) {
  return (
    <div className={cn("w-full space-y-3", className)}>
      {/* Scrollable Container with Right-Edge Fade Hint on Mobile */}
      <div className="relative border border-[var(--line)] rounded-[6px] overflow-hidden bg-[var(--paper)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left border-collapse text-xs sm:text-sm font-sans">
            <caption className="sr-only">{caption}</caption>
            <thead>
              <tr className="bg-[var(--bone)] border-b border-[var(--line)] text-[11px] uppercase tracking-[0.14em] font-semibold text-[var(--forest)]">
                <th scope="col" className="py-3.5 px-5">
                  Active Ingredient
                </th>
                <th scope="col" className="py-3.5 px-5">
                  Standardised Specification
                </th>
                <th scope="col" className="py-3.5 px-5 text-right tabular-nums">
                  Quantity / Unit
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    "border-b border-[var(--line)] last:border-b-0 transition-colors",
                    idx % 2 === 1 ? "bg-[var(--bone)]/50" : "bg-[var(--paper)]"
                  )}
                >
                  <td className="py-3.5 px-5 font-semibold text-[var(--ink)]">
                    {row.ingredient}
                  </td>
                  <td className="py-3.5 px-5 text-[var(--sage)]">
                    {row.standardisedTo}
                  </td>
                  <td className="py-3.5 px-5 font-medium text-[var(--ink)] text-right tabular-nums">
                    {row.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {footnote && (
        <p className="text-[12px] font-sans text-[var(--sage)] leading-relaxed pl-1">
          {footnote}
        </p>
      )}
    </div>
  );
}
