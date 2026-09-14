"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/types/product";
import { ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article
      className={cn(
        "group relative bg-white border border-[#123C2D]/10 rounded-xs overflow-hidden flex flex-col transition-all duration-300 hover:border-[#123C2D]/30 hover:shadow-[0_12px_36px_rgba(18,60,45,0.08)]",
        className
      )}
    >
      {/* Product Image Stage */}
      <Link
        href={`/products/${product.slug}`}
        aria-label={`View ${product.name} details`}
        className="relative w-full aspect-[4/3] bg-[#F4F5EF] overflow-hidden block cursor-pointer"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Subtle category badge overlay */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] font-sans font-medium bg-white/90 backdrop-blur-xs text-[#123C2D] border border-[#123C2D]/10 rounded-xs shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24]" />
            {product.category}
          </span>
        </div>
      </Link>

      {/* Content details */}
      <div className="p-6 md:p-7 flex flex-col flex-1 justify-between bg-white">
        <div className="space-y-3">
          {/* Packaging / Form spec note */}
          <div className="flex items-center justify-between text-[11px] font-sans text-[#52635A] tracking-wider uppercase">
            <span>{product.form}</span>
            <span>{product.packaging.split("(")[0].trim()}</span>
          </div>

          {/* Product Name */}
          <h3 className="text-xl md:text-2xl font-serif font-semibold text-[#171B18] tracking-tight group-hover:text-[#123C2D] transition-colors duration-200">
            <Link href={`/products/${product.slug}`} className="cursor-pointer">
              {product.name}
            </Link>
          </h3>

          {/* Subtitle / Wellness focus */}
          <p className="text-xs font-sans text-[#52635A] leading-relaxed line-clamp-2">
            {product.shortDescription}
          </p>

          {/* Highlight attributes */}
          {product.keyFocus && product.keyFocus.length > 0 && (
            <div className="pt-2 border-t border-[#123C2D]/8">
              <span className="text-[10px] uppercase tracking-[0.14em] text-[#52635A] block mb-1 font-medium">
                Targeted Wellness:
              </span>
              <p className="text-xs font-sans text-[#171B18] font-medium leading-snug flex items-center gap-1.5">
                <Sparkles size={12} className="text-[#A87560] shrink-0" />
                {product.keyFocus[0]}
              </p>
            </div>
          )}
        </div>

        {/* Action button row */}
        <div className="pt-6 mt-6 border-t border-[#123C2D]/8 flex items-center justify-between gap-3">
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] font-semibold text-[#123C2D] group-hover:text-[#294F3D] py-2 transition-colors cursor-pointer"
          >
            <span>View Product</span>
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href={`/enquire?product=${product.slug}`}
            className="px-3.5 py-1.5 text-[11px] uppercase tracking-[0.14em] font-sans font-medium text-[#123C2D] border border-[#123C2D]/25 hover:bg-[#123C2D] hover:text-white rounded-xs transition-colors cursor-pointer"
          >
            Enquire Now
          </Link>
        </div>
      </div>
    </article>
  );
}
