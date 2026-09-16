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

export function ProductCard({ product, className }: ProductCardProps) {
  // Clean formatting for the meta row to prevent any concatenation bugs
  const formLabel = product.form || "Formulation";
  const packLabel = product.packaging
    ? product.packaging.replace(/\(.*?\)/g, "").trim()
    : "Standard Pack";

  return (
    <article
      className={cn(
        "group relative bg-[var(--paper)] border border-[var(--line)] rounded-[6px] overflow-hidden flex flex-col transition-all duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:border-[var(--sage)] hover:-translate-y-0.5",
        className
      )}
    >
      {/* Product Image Stage on Warm Bone Plinth */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View formulation details for ${product.name}`}
        className="relative w-full aspect-[4/3] bg-[var(--bone)] overflow-hidden block cursor-pointer border-b border-[var(--line)]"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />

        {/* Category Chip */}
        <div className="absolute top-3.5 left-3.5 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-[0.14em] font-sans font-medium bg-[var(--paper)] text-[var(--forest)] border border-[var(--line)] rounded-[4px] shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
            {product.category}
          </span>
        </div>
      </Link>

      {/* Content Details */}
      <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-[var(--paper)]">
        <div className="space-y-3">
          {/* Spec / Meta Row with Explicit Separator */}
          <div className="flex items-center gap-2 text-[11px] font-sans text-[var(--sage)] tracking-[0.1em] uppercase">
            <span className="font-medium text-[var(--ink)]/70">{formLabel}</span>
            <span className="text-[var(--line)] font-bold">·</span>
            <span className="tabular-nums">{packLabel}</span>
          </div>

          {/* Product Name (Editorial Serif) */}
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)] tracking-tight leading-tight group-hover:text-[var(--forest)] transition-colors">
            <Link href={`/products/${product.slug}`} className="cursor-pointer">
              {product.name}
            </Link>
          </h3>

          {/* One-Sentence Description constrained to 60ch */}
          <p className="text-sm font-sans text-[var(--ink)]/80 leading-relaxed max-w-[55ch] line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Targeted System Focus Row */}
          {product.wellnessFocus && (
            <div className="pt-2 border-t border-[var(--line)] flex items-start gap-2 text-xs font-sans text-[var(--sage)]">
              <ShieldCheck size={15} strokeWidth={1.5} className="text-[var(--forest)] shrink-0 mt-0.5" />
              <span className="line-clamp-1">{product.wellnessFocus}</span>
            </div>
          )}
        </div>

        {/* Single Conversion Action: View Formulation Link */}
        <div className="pt-5 mt-4 border-t border-[var(--line)] flex items-center justify-between">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--forest)] group-hover:text-[var(--forest-700)] transition-colors cursor-pointer"
          >
            <span>View Formulation</span>
            <ArrowRight
              size={13}
              strokeWidth={1.75}
              className="transition-transform duration-180 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
