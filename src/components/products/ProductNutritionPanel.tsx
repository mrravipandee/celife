"use client";

import React from "react";
import { Product } from "@/types/product";
import { ShieldAlert, Info, Flame, Sparkles } from "lucide-react";

interface ProductNutritionPanelProps {
  product: Product;
}

export function ProductNutritionPanel({ product }: ProductNutritionPanelProps) {
  const hasComposition = product.composition && product.composition.length > 0;
  const hasNutrition =
    product.nutrition &&
    (product.nutrition.energy ||
      product.nutrition.fat ||
      product.nutrition.protein ||
      product.nutrition.carbohydrates ||
      product.nutrition.servingSize);
  const hasOtherIngredients =
    product.otherIngredients && product.otherIngredients.length > 0;
  const hasWarnings = product.warnings && product.warnings.length > 0;
  const hasStorage =
    product.storageInstructions && product.storageInstructions.length > 0;

  if (!hasComposition && !hasNutrition && !hasOtherIngredients && !hasWarnings) {
    return null;
  }

  return (
    <div className="w-full space-y-12 sm:space-y-16">
      {/* 1. Nutritional Facts & Composition Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Col: Composition Table with RDA display */}
        {hasComposition && (
          <div className={hasNutrition ? "lg:col-span-8 space-y-4" : "lg:col-span-12 space-y-4"}>
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div>
                <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                  Active Formulation Profile
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)]">
                  Composition & RDA Breakdown
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[var(--sage)] bg-[var(--paper)] px-2.5 py-1 border border-[var(--line)] rounded">
                {product.composition!.length} Actives
              </span>
            </div>

            {product.nutrition?.servingSize && (
              <p className="text-xs text-[var(--sage)] font-sans italic">
                Values per: <strong className="text-[var(--ink)] not-italic">{product.nutrition.servingSize}</strong>
              </p>
            )}

            <div className="border border-[var(--line)] rounded-[6px] overflow-hidden bg-[var(--paper)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
                  <thead>
                    <tr className="bg-[var(--bone)]/70 border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--sage)] font-semibold">
                      <th className="py-3 px-4 sm:px-5">Active Constituent / Ingredient</th>
                      <th className="py-3 px-3 text-right">Amount</th>
                      <th className="py-3 px-4 sm:px-5 text-right">% RDA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--line)]/60">
                    {product.composition!.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-[var(--bone)]/40 transition-colors"
                      >
                        <td className="py-3 px-4 sm:px-5 font-medium text-[var(--ink)]">
                          {item.ingredient}
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-xs tabular-nums text-[var(--ink)]/80">
                          {item.amount !== null && item.amount !== undefined
                            ? `${item.amount} ${item.unit || ""}`.trim()
                            : "—"}
                        </td>
                        <td className="py-3 px-4 sm:px-5 text-right font-mono text-xs tabular-nums font-semibold text-[var(--forest)]">
                          {item.rdaDisplay}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-3 bg-[var(--bone)]/30 border-t border-[var(--line)] text-[11px] text-[var(--sage)] font-sans">
                <span>* % RDA based on ICMR / FSSAI guidelines for adult men/women sedentary work.</span>
                <span className="ml-3 font-semibold"># RDA not established or values as per formulation guidelines.</span>
              </div>
            </div>
          </div>
        )}

        {/* Right Col: Nutrition Facts Card */}
        {hasNutrition && (
          <div className={hasComposition ? "lg:col-span-4 space-y-4" : "lg:col-span-6 space-y-4"}>
            <div className="border-b border-[var(--line)] pb-3">
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                Caloric & Macronutrient Matrix
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)]">
                Nutritional Information
              </h3>
            </div>

            <div className="border border-[var(--line)] rounded-[6px] p-5 sm:p-6 bg-[var(--paper)] space-y-4 shadow-xs">
              {product.nutrition?.servingSize && (
                <div className="pb-3 border-b border-[var(--line)] flex items-center justify-between text-xs font-sans">
                  <span className="text-[var(--sage)]">Serving Size:</span>
                  <span className="font-semibold text-[var(--ink)] font-mono">
                    {product.nutrition.servingSize}
                  </span>
                </div>
              )}

              <dl className="divide-y divide-[var(--line)]/60 text-xs sm:text-sm font-sans">
                {product.nutrition?.energy && (
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="flex items-center gap-1.5 text-[var(--ink)] font-medium">
                      <Flame size={13} className="text-[var(--clay)]" />
                      <span>Energy</span>
                    </dt>
                    <dd className="font-mono font-semibold tabular-nums text-[var(--ink)]">
                      {product.nutrition.energy}
                    </dd>
                  </div>
                )}

                {product.nutrition?.protein && (
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-[var(--ink)] font-medium">Protein</dt>
                    <dd className="font-mono font-semibold tabular-nums text-[var(--ink)]">
                      {product.nutrition.protein}
                    </dd>
                  </div>
                )}

                {product.nutrition?.carbohydrates && (
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-[var(--ink)] font-medium">Carbohydrates</dt>
                    <dd className="font-mono font-semibold tabular-nums text-[var(--ink)]">
                      {product.nutrition.carbohydrates}
                    </dd>
                  </div>
                )}

                {product.nutrition?.fat && (
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-[var(--ink)] font-medium">Total Fat</dt>
                    <dd className="font-mono font-semibold tabular-nums text-[var(--ink)]">
                      {product.nutrition.fat}
                    </dd>
                  </div>
                )}

                {product.nutrition?.excipients && (
                  <div className="py-2.5 flex items-center justify-between">
                    <dt className="text-[var(--sage)]">Excipients</dt>
                    <dd className="font-mono text-xs text-[var(--sage)]">
                      {product.nutrition.excipients}
                    </dd>
                  </div>
                )}
              </dl>

              {product.sugarStatement && (
                <div className="pt-2 border-t border-[var(--line)]">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-medium font-sans">
                    <Sparkles size={12} className="text-emerald-600" />
                    <span>{product.sugarStatement}</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 2. Packaging Ingredients, Usage & Storage Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 items-start">
        {/* Other Ingredients (Excipients List) */}
        {hasOtherIngredients && (
          <div className="lg:col-span-7 space-y-3">
            <h4 className="text-xs uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
              Other Ingredients & Excipients
            </h4>
            <div className="border border-[var(--line)] rounded-[6px] p-5 bg-[var(--paper)] text-xs font-sans text-[var(--ink)]/80 leading-relaxed">
              <p>{product.otherIngredients!.join(", ")}.</p>
            </div>
          </div>
        )}

        {/* Directions & Storage Instructions */}
        <div className={hasOtherIngredients ? "lg:col-span-5 space-y-4" : "lg:col-span-12 space-y-4"}>
          {product.recommendedUsage && (
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                Recommended Usage
              </h4>
              <div className="border border-[var(--line)] rounded-[6px] p-4 bg-[var(--paper)] text-xs sm:text-sm font-sans text-[var(--ink)]">
                {product.recommendedUsage}
              </div>
            </div>
          )}

          {hasStorage && (
            <div className="space-y-1.5">
              <h4 className="text-xs uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                Storage Instructions
              </h4>
              <ul className="border border-[var(--line)] rounded-[6px] p-4 bg-[var(--paper)] text-xs font-sans text-[var(--ink)]/80 space-y-1.5 list-disc list-inside">
                {product.storageInstructions!.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* 3. Regulatory Packaging Warnings */}
      {hasWarnings && (
        <div className="border border-[var(--line)] rounded-[6px] p-5 sm:p-6 bg-[var(--paper)] space-y-3">
          <div className="flex items-center gap-2">
            <ShieldAlert size={16} className="text-[var(--clay)] shrink-0" />
            <span className="text-xs uppercase tracking-[0.16em] font-sans font-bold text-[var(--ink)]">
              Product Information & Packaging Warnings
            </span>
          </div>

          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-sans text-[var(--ink)]/75">
            {product.warnings!.map((warning, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[var(--clay)] font-bold">·</span>
                <span>{warning}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
