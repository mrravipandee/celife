"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  variant?: "table" | "card" | "form" | "spinner";
  columnsCount?: number;
  rowsCount?: number;
  text?: string;
}

export function LoadingState({
  variant = "spinner",
  columnsCount = 6,
  rowsCount = 3,
  text = "Loading data...",
}: LoadingStateProps) {
  if (variant === "spinner") {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-[#FFFFFF] border border-[#E1E8E2] rounded-xs select-none">
        <Loader2 className="animate-spin text-[#123C2D] mb-3" size={22} />
        <span className="text-[11px] uppercase tracking-wider text-[#68756D] font-sans font-medium">
          {text}
        </span>
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className="space-y-6 animate-pulse select-none">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center border-b border-[#E1E8E2] pb-6">
          <div className="space-y-2">
            <div className="bg-[#E1E8E2] h-6 w-64 rounded-xs" />
            <div className="bg-[#E1E8E2] h-3 w-48 rounded-xs" />
          </div>
          <div className="bg-[#E1E8E2] h-10 w-32 rounded-xs" />
        </div>
        {/* Form Grid Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#FFFFFF] border border-[#E1E8E2] p-6 h-96 rounded-xs" />
          </div>
          <div className="bg-[#FFFFFF] border border-[#E1E8E2] p-6 h-64 rounded-xs" />
        </div>
      </div>
    );
  }

  if (variant === "table" || variant === "card") {
    const pulseRows = Array.from({ length: rowsCount });
    const pulseCols = Array.from({ length: columnsCount - 1 });

    return (
      <div className="w-full">
        {/* Desktop Skeleton Table */}
        <div className="hidden md:block w-full overflow-hidden border border-[#E1E8E2] bg-[#FFFFFF] rounded-xs select-none">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E1E8E2] bg-[#F0F4F0] text-[10px] uppercase tracking-[0.14em] text-[#123C2D]">
                <th className="py-3.5 px-5 font-semibold">Details</th>
                {pulseCols.map((_, i) => (
                  <th key={i} className="py-3.5 px-5 font-semibold">
                    <div className="bg-[#E1E8E2] h-3 w-16 rounded-xs animate-pulse" />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E8E2]">
              {pulseRows.map((_, rIdx) => (
                <tr key={rIdx} className="border-b border-[#E1E8E2] animate-pulse">
                  <td className="py-4 px-5 max-w-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#E1E8E2] w-10 h-8 rounded-xs shrink-0" />
                      <div className="flex flex-col gap-2 min-w-0">
                        <div className="bg-[#E1E8E2] h-3.5 w-44 rounded-xs" />
                        <div className="bg-[#E1E8E2] h-2.5 w-28 rounded-xs" />
                      </div>
                    </div>
                  </td>
                  {pulseCols.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-5">
                      <div className={`bg-[#E1E8E2] h-3.5 rounded-xs ${cIdx % 2 === 0 ? 'w-24' : 'w-16'}`} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Skeleton Cards Stack */}
        <div className="block md:hidden space-y-3">
          {pulseRows.map((_, mIdx) => (
            <div
              key={mIdx}
              className="bg-[#FFFFFF] border border-[#E1E8E2] p-5 rounded-xs space-y-3 animate-pulse select-none"
            >
              <div className="flex items-center gap-3">
                <div className="bg-[#E1E8E2] w-10 h-8 rounded-xs shrink-0" />
                <div className="bg-[#E1E8E2] h-3.5 w-2/3 rounded-xs" />
              </div>
              <div className="border-l-2 border-[#E1E8E2] pl-3 space-y-2">
                <div className="bg-[#E1E8E2] h-2.5 w-1/3 rounded-xs" />
                <div className="bg-[#E1E8E2] h-2.5 w-1/4 rounded-xs" />
              </div>
              <div className="pt-2 border-t border-[#E1E8E2] flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="bg-[#E1E8E2] h-3.5 w-16 rounded-xs" />
                  <div className="bg-[#E1E8E2] h-2.5 w-20 rounded-xs" />
                </div>
                <div className="bg-[#E1E8E2] h-4 w-4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
