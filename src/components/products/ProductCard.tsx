import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

const mrpMap: Record<string, { mrp: string; pack: string }> = {
  "nervify-forte": { mrp: "₹890", pack: "Box of 60 Tablets" },
  "orthocare-active": { mrp: "₹750", pack: "Box of 60 Tablets" },
  "livcleanse-synergy": { mrp: "₹680", pack: "Box of 60 Tablets" },
  "immunoshield-daily": { mrp: "₹620", pack: "Box of 60 Tablets" },
  "vitafiv-syrup": { mrp: "₹245", pack: "200 ml Amber Bottle" },
};

export function ProductCard({ product, className }: ProductCardProps) {
  const formLabel = product.form || "Standardised Active";
  const packLabel = product.packaging
    ? product.packaging.replace(/\(.*?\)/g, "").trim()
    : "Verified Packaging";

  const pricing = mrpMap[product.slug] || { mrp: "₹750", pack: packLabel };

  return (
    <article
      className={cn(
        "group relative bg-[var(--paper)] border border-[var(--line)] rounded-[8px] overflow-hidden flex flex-col transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:border-[var(--sage)] hover:shadow-sm",
        className
      )}
    >
      {/* Product Image Stage */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`${product.category}: View formulation details for ${product.name}`}
        className="relative w-full aspect-[4/3] bg-[var(--bone)] overflow-hidden block cursor-pointer border-b border-[var(--line)]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />

        {/* Category Pill Badge */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-medium bg-[var(--paper)]/95 backdrop-blur-xs text-[var(--forest)] border border-[var(--line)] rounded-full shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
            {product.category}
          </span>
        </div>
      </Link>

      {/* Content Details */}
      <div className="p-5 sm:p-7 flex flex-col flex-1 justify-between bg-[var(--paper)] space-y-4">
        <div className="space-y-2.5">
          {/* Form & Packaging Specification Meta */}
          <div className="flex items-center gap-2 text-[11px] text-[var(--sage)] tracking-[0.1em] uppercase font-medium">
            <span className="text-[var(--ink)]/80">{formLabel}</span>
            <span className="text-[var(--line)] font-bold">·</span>
            <span className="tabular-nums">{pricing.pack}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-tight leading-tight group-hover:text-[var(--forest)] transition-colors">
            <Link href={`/products/${product.slug}`} className="cursor-pointer">
              {product.name}
            </Link>
          </h3>

          {/* Clean Description */}
          <p className="text-xs sm:text-sm text-[var(--ink)]/75 leading-relaxed max-w-[55ch] line-clamp-2 font-light">
            {product.shortDescription}
          </p>

          {/* Targeted Focus Indication */}
          {product.wellnessFocus && (
            <div className="pt-2 border-t border-[var(--line)]/60 flex items-center gap-2 text-[11px] sm:text-xs text-[var(--sage)]">
              <ShieldCheck size={14} strokeWidth={1.75} className="text-[var(--forest)] shrink-0" />
              <span className="line-clamp-1 font-medium">{product.wellnessFocus}</span>
            </div>
          )}
        </div>

        {/* Pricing & Centered Mobile Action */}
        <div className="pt-4 border-t border-[var(--line)] space-y-4">
          {/* Real MRP Display */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.12em] text-[var(--sage)] font-semibold">
                MRP (Incl. All Taxes)
              </span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-lg sm:text-xl font-bold text-[var(--ink)] tabular-nums">
                  {pricing.mrp}
                </span>
                <span className="text-[10px] text-[var(--sage)]">/ unit</span>
              </div>
            </div>

            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-[#F0F4F0] text-[var(--forest)] border border-[#E1E8E2]">
              In Stock
            </span>
          </div>

          {/* Centered CTA Button on Mobile */}
          <div className="flex items-center justify-center pt-1">
            <Link
              href={`/products/${product.slug}`}
              className="w-full sm:w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[var(--forest)] hover:bg-[var(--forest-700)] text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-xs group"
            >
              <span>View Full Formulation</span>
              <ArrowRight
                size={13}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
