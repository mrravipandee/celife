import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { ArrowRight, Package, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage =
    product.images?.[0]?.url ||
    product.image ||
    "";

  // Build concise metadata string: format/form and pack size
  const metaParts: string[] = [];
  if (product.dosageForm || product.format || product.form) {
    metaParts.push(product.dosageForm || product.format || product.form || "");
  }
  if (product.packSize || product.packaging) {
    metaParts.push(product.packSize || product.packaging?.replace(/\(.*?\)/g, "").trim() || "");
  }

  const metaLabel = metaParts.filter(Boolean).join(" · ");

  return (
    <article
      className={cn(
        "group relative bg-[var(--paper)] border border-[var(--line)] rounded-[8px] overflow-hidden flex flex-col transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:border-[var(--sage)] hover:shadow-md",
        className
      )}
    >
      {/* Product Image Stage */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`${product.category}: View formulation details for ${product.name}`}
        className="relative w-full aspect-[4/3] bg-[var(--bone)] overflow-hidden block cursor-pointer border-b border-[var(--line)]"
      >
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[var(--sage)]/60 p-6 text-center space-y-2">
            <Package size={36} strokeWidth={1.25} />
            <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-medium">
              Celife Formulation
            </span>
          </div>
        )}

        {/* Category Pill Badge */}
        {product.category && (
          <div className="absolute top-3.5 left-3.5 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] uppercase tracking-[0.14em] font-medium bg-[var(--paper)]/95 backdrop-blur-xs text-[var(--forest)] border border-[var(--line)] rounded-full shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
              {product.category}
            </span>
          </div>
        )}
      </Link>

      {/* Content Details */}
      <div className="p-5 sm:p-7 flex flex-col flex-1 justify-between bg-[var(--paper)] space-y-4">
        <div className="space-y-2.5">
          {/* Form & Packaging Specification Meta */}
          {metaLabel && (
            <div className="flex items-center gap-2 text-[11px] text-[var(--sage)] tracking-[0.08em] uppercase font-medium line-clamp-1">
              <span>{metaLabel}</span>
            </div>
          )}

          {/* Product Name */}
          <h3 className="text-xl sm:text-2xl font-bold text-[var(--ink)] tracking-tight leading-tight group-hover:text-[var(--forest)] transition-colors">
            <Link href={`/products/${product.slug}`} className="cursor-pointer">
              {product.name}
            </Link>
          </h3>

          {/* Description (Only if verified text exists) */}
          {product.shortDescription ? (
            <p className="text-xs sm:text-sm text-[var(--ink)]/75 leading-relaxed max-w-[55ch] line-clamp-2 font-light">
              {product.shortDescription}
            </p>
          ) : product.description ? (
            <p className="text-xs sm:text-sm text-[var(--ink)]/75 leading-relaxed max-w-[55ch] line-clamp-2 font-light">
              {product.description}
            </p>
          ) : null}

          {/* Targeted Focus / Domain Indication */}
          {(product.wellnessFocus || product.therapeuticDomain) && (
            <div className="pt-2 border-t border-[var(--line)]/60 flex items-center gap-2 text-[11px] sm:text-xs text-[var(--sage)]">
              <ShieldCheck size={14} strokeWidth={1.75} className="text-[var(--forest)] shrink-0" />
              <span className="line-clamp-1 font-medium">
                {product.wellnessFocus || product.therapeuticDomain}
              </span>
            </div>
          )}
        </div>

        {/* Action Button: Information-First View Details CTA */}
        <div className="pt-4 border-t border-[var(--line)]">
          <Link
            href={`/products/${product.slug}`}
            className="w-full inline-flex items-center justify-between px-5 py-3 bg-[var(--bone)] hover:bg-[var(--forest)] text-[var(--forest)] hover:text-white rounded-[6px] text-xs font-semibold uppercase tracking-wider transition-all duration-200 border border-[var(--line)] hover:border-[var(--forest)] group/btn"
          >
            <span>View Details</span>
            <ArrowRight
              size={14}
              className="transition-transform duration-200 group-hover/btn:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
