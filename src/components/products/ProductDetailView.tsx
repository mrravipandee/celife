"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { ArrowLeft, CheckCircle2, ShieldCheck, HelpCircle, Send } from "lucide-react";

interface ProductDetailViewProps {
  product: Product;
}

export function ProductDetailView({ product }: ProductDetailViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20">
      {/* Breadcrumb row */}
      <nav aria-label="Breadcrumbs" className="mb-8 flex items-center gap-2 text-xs font-sans text-[#52635A]">
        <Link href="/" className="hover:text-[#123C2D] transition-colors">
          Home
        </Link>
        <span className="text-[#81998D]">/</span>
        <Link href="/products" className="hover:text-[#123C2D] transition-colors">
          Products
        </Link>
        <span className="text-[#81998D]">/</span>
        <span className="text-[#123C2D] font-medium">{product.name}</span>
      </nav>

      {/* Back to Products link */}
      <div className="mb-8">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] font-sans font-semibold text-[#123C2D] hover:text-[#294F3D] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Product Catalogue</span>
        </Link>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* Left: Product Imagery Showcase */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative aspect-[4/3] w-full bg-[#F4F5EF] border border-[#123C2D]/10 rounded-xs overflow-hidden shadow-sm">
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />

            {/* Subtle Brand Tag Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs uppercase tracking-[0.18em] font-sans font-medium bg-white/95 backdrop-blur-xs text-[#123C2D] border border-[#123C2D]/10 rounded-xs shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ED1C24]" />
                {product.category}
              </span>
            </div>
          </div>

          {/* Clean Quality Assurance Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 bg-white border border-[#123C2D]/8 rounded-xs text-center">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#52635A] block font-medium">Form</span>
              <span className="text-xs font-sans font-semibold text-[#171B18] mt-0.5 block">{product.form}</span>
            </div>
            <div className="p-3.5 bg-white border border-[#123C2D]/8 rounded-xs text-center">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#52635A] block font-medium">Packaging</span>
              <span className="text-xs font-sans font-semibold text-[#171B18] mt-0.5 block">{product.packaging.split("(")[0].trim()}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-3.5 bg-white border border-[#123C2D]/8 rounded-xs text-center">
              <span className="text-[10px] uppercase tracking-[0.16em] text-[#52635A] block font-medium">Quality Focus</span>
              <span className="text-xs font-sans font-semibold text-[#123C2D] mt-0.5 block">Evidence-Guided</span>
            </div>
          </div>
        </div>

        {/* Right: Product Specifications & Enquiry Flow */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <span className="text-xs uppercase tracking-[0.24em] text-[#A87560] font-sans font-bold block mb-2">
              Celife Product Information
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#171B18] tracking-tight leading-[1.12]">
              {product.name}
            </h1>
            <p className="text-sm font-sans font-medium text-[#52635A] mt-2 leading-snug">
              {product.subtitle}
            </p>
          </div>

          {/* Primary Short Description */}
          <div className="border-t border-b border-[#123C2D]/10 py-5">
            <p className="text-sm sm:text-base font-sans text-[#171B18]/85 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Targeted Key Focus Points */}
          {product.keyFocus && product.keyFocus.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-xs uppercase tracking-[0.18em] font-sans font-bold text-[#123C2D]">
                Targeted Wellness Profile
              </h2>
              <ul className="space-y-2.5">
                {product.keyFocus.map((focusItem, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm font-sans text-[#171B18]/90 leading-snug">
                    <CheckCircle2 size={16} className="text-[#123C2D] mt-0.5 shrink-0" />
                    <span>{focusItem}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Formulation & Usage Specifications */}
          <div className="space-y-4 bg-white border border-[#123C2D]/10 rounded-xs p-6 shadow-xs">
            <h3 className="text-xs uppercase tracking-[0.18em] font-sans font-bold text-[#123C2D] flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#123C2D]" />
              Formulation & Presentation
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <span className="text-[#52635A] block uppercase tracking-wider text-[10px]">Formulation Matrix:</span>
                <p className="text-[#171B18] font-medium mt-0.5">{product.formulation}</p>
              </div>
              <div>
                <span className="text-[#52635A] block uppercase tracking-wider text-[10px]">Packaging Details:</span>
                <p className="text-[#171B18] font-medium mt-0.5">{product.packaging}</p>
              </div>
            </div>

            {product.usageAdvice && (
              <div className="pt-3 border-t border-[#123C2D]/8 text-xs font-sans">
                <span className="text-[#52635A] block uppercase tracking-wider text-[10px]">Usage & Storage:</span>
                <p className="text-[#171B18] mt-0.5 text-xs text-[#52635A]">{product.usageAdvice}</p>
              </div>
            )}
          </div>

          {/* Strong Primary Enquiry CTA Section */}
          <div className="p-6 md:p-8 bg-[#123C2D] text-white rounded-xs space-y-4 shadow-xl">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
                <span className="text-[10px] uppercase tracking-[0.24em] font-sans font-semibold text-[#C4D5C7]">
                  Product Enquiry & Information
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
                Enquire About {product.name}
              </h2>
              <p className="text-xs font-sans text-white/75 leading-relaxed max-w-md">
                Looking for detailed distribution inquiries, wholesale requirements, or technical product documentation? Submit an enquiry directly to our healthcare team.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link
                href={`/enquire?product=${product.slug}`}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 text-xs uppercase tracking-[0.2em] font-semibold bg-white text-[#123C2D] hover:bg-[#F4F5EF] transition-all rounded-xs shadow-md cursor-pointer"
              >
                <span>Enquire Now</span>
                <Send size={13} className="text-[#123C2D]" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-5 py-4 text-xs uppercase tracking-[0.16em] font-medium text-white/85 border border-white/20 hover:border-white hover:text-white transition-colors rounded-xs cursor-pointer"
              >
                <HelpCircle size={14} />
                <span>General Questions</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
