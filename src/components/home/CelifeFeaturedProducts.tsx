import React from "react";
import Link from "next/link";
import { productsData } from "@/data/products";
import { ProductCard } from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";

export function CelifeFeaturedProducts() {
  const featured = productsData.slice(0, 3);

  return (
    <section className="py-20 md:py-28 bg-[#F8FAF6]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div className="max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
              <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
                Featured Formulations
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#171B18] tracking-tight leading-tight">
              Curated Healthcare & Wellness Solutions
            </h2>

            <p className="text-sm sm:text-base font-sans text-[#52635A] leading-relaxed">
              Explore our core product portfolio formulated for neuro-vitality, joint mobility, and systemic wellness.
            </p>
          </div>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#123C2D] hover:text-[#294F3D] transition-colors pb-1 border-b border-[#123C2D]/30 hover:border-[#123C2D] shrink-0 cursor-pointer"
          >
            <span>View All Formulations</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
