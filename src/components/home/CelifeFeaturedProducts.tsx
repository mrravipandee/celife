import React from "react";
import Link from "next/link";
import { Product } from "@/types/product";
import { getFeaturedProducts } from "@/lib/services/products";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";

interface CelifeFeaturedProductsProps {
  content?: {
    eyebrow?: string;
    heading?: string;
    description?: string;
  };
  products?: Product[];
}

export async function CelifeFeaturedProducts({ content, products }: CelifeFeaturedProductsProps) {
  const featured = products || (await getFeaturedProducts());
  const displayProducts = featured.slice(0, 3);

  const eyebrow = content?.eyebrow || "FORMULATION PORTFOLIO";
  const heading = content?.heading || "Targeted Formulations Crafted for Vitality";
  const description =
    content?.description ||
    "Every Celife product is engineered with standardized bioactives to support specific physiological domains — verified for consistency and batch purity.";

  return (
    <section className="py-20 md:py-28 lg:py-32 bg-[var(--bone)]">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-16 text-center md:text-left items-center md:items-end">
          <div className="max-w-2xl space-y-3 flex flex-col items-center md:items-start">
            <div className="flex items-center justify-center md:justify-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                {eyebrow}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-bold text-[var(--ink)] tracking-tight leading-[1.12]">
              {heading}
            </h2>

            <p className="text-xs sm:text-base font-sans text-[var(--ink)]/80 leading-relaxed max-w-[65ch] font-light">
              {description}
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 text-xs uppercase tracking-[0.14em] font-semibold text-[var(--forest)] hover:text-[var(--forest-700)] transition-colors border-b border-[var(--forest)] pb-0.5 shrink-0 self-center md:self-auto"
          >
            <span>View Full Catalogue</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 3-up Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-8 xl:gap-10">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
