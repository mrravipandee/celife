"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";
import { getFormulationDetail } from "@/data/product-formulation-details";
import { SpecTable, CompositionTable } from "@/components/ui/SpecTable";
import { ActiveNodeDiagram } from "@/components/products/ActiveNodeDiagram";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { StickyMobileActionBar } from "@/components/products/StickyMobileActionBar";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { ArrowLeft, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailView({
  product,
  relatedProducts = [],
}: ProductDetailViewProps) {
  const detail = getFormulationDetail(product.slug);
  const [selectedImage, setSelectedImage] = useState<string>(product.image);

  const thumbnails = [
    { label: "Pack View", src: product.image },
    { label: "Formulation", src: product.image },
    { label: "Specification", src: product.image },
  ];

  return (
    <div className="w-full bg-[var(--bone)] text-[var(--ink)]">
      {/* Sticky Mobile Action Bar */}
      <StickyMobileActionBar
        productName={product.name}
        productSlug={product.slug}
        category={product.category}
      />

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-32 pb-20 md:pt-36 md:pb-28">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumbs"
          className="mb-8 flex items-center gap-2 text-xs font-sans text-[var(--sage)]"
        >
          <Link href="/" className="hover:text-[var(--forest)] transition-colors">
            Home
          </Link>
          <span className="text-[var(--line)] font-bold">/</span>
          <Link href="/products" className="hover:text-[var(--forest)] transition-colors">
            Products
          </Link>
          <span className="text-[var(--line)] font-bold">/</span>
          <span className="text-[var(--sage)]">{product.category}</span>
          <span className="text-[var(--line)] font-bold">/</span>
          <span className="text-[var(--forest)] font-medium">{product.name}</span>
        </nav>

        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] font-sans font-semibold text-[var(--forest)] hover:text-[var(--forest-700)] transition-colors"
          >
            <ArrowLeft size={13} strokeWidth={2} />
            <span>Back to Product Catalogue</span>
          </Link>
        </div>

        {/* 1. Product Hero (6/6 Asymmetric Split) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (6 cols): Product Image on Bone Plinth + Thumbnails */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[6px] p-4 sm:p-6 shadow-xs">
              <div className="relative aspect-[4/3] sm:aspect-[1/1] w-full rounded-[4px] overflow-hidden bg-[var(--bone)]/50">
                <Image
                  src={selectedImage}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center transition-opacity duration-300"
                />
              </div>
            </div>

            {/* Thumbnail States Below Image */}
            <div className="grid grid-cols-3 gap-3">
              {thumbnails.map((thumb, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(thumb.src)}
                  className={cn(
                    "relative aspect-[4/3] rounded-[4px] overflow-hidden border p-1 bg-[var(--paper)] transition-all cursor-pointer",
                    selectedImage === thumb.src
                      ? "border-[var(--forest)] ring-1 ring-[var(--forest)]"
                      : "border-[var(--line)] hover:border-[var(--sage)]"
                  )}
                >
                  <div className="relative w-full h-full bg-[var(--bone)]/40 rounded-[2px] overflow-hidden">
                    <Image
                      src={thumb.src}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover object-center"
                    />
                  </div>
                  <span className="sr-only">{thumb.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right Column (6 cols): Sticky Formulation Specs & Primary Conversion */}
          <div className="lg:col-span-6 lg:sticky lg:top-32 space-y-6">
            {/* Category Eyebrow with Single Clay Dot */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-serif font-bold text-[var(--ink)] tracking-tight leading-[1.08]">
              {product.name}
            </h1>

            {/* One-Line Positioning Statement */}
            <p className="text-sm sm:text-base font-sans text-[var(--ink)]/80 leading-[1.65] max-w-[60ch]">
              {detail.positioning}
            </p>

            {/* Hairline Spec Table */}
            <SpecTable
              caption={`${product.name} technical specifications`}
              rows={detail.specs}
            />

            {/* Primary & Tertiary Conversion Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="primary"
                href={`/enquire?product=${product.slug}`}
                showArrow
                className="py-4 px-6 text-center"
              >
                Enquire About This Formulation
              </Button>

              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--forest)] hover:text-[var(--forest-700)] border-b border-[var(--forest)] py-1 transition-colors cursor-pointer"
              >
                <FileText size={14} />
                <span>Download Specification Sheet →</span>
              </button>
            </div>

            {/* Practitioner Advisory Footnote */}
            <p className="text-[12px] font-sans text-[var(--sage)] leading-relaxed pt-1">
              For professional evaluation and use under the guidance of a qualified healthcare practitioner.
            </p>
          </div>
        </div>

        {/* Section Divider */}
        <div className="my-16 md:my-24">
          <SectionDivider />
        </div>

        {/* 2. Formulation Overview (7/5 Asymmetric Split) */}
        <section className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left 7 cols: About this formulation */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
                <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                  Scientific Background
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--ink)] tracking-tight">
                About this formulation
              </h2>

              <div className="space-y-4 text-sm sm:text-base font-sans text-[var(--ink)]/80 leading-[1.7] max-w-[65ch]">
                {detail.overviewParagraphs.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>

            {/* Right 5 cols: Pull-Quote Card in Hairline Box */}
            <div className="lg:col-span-5">
              <div className="border border-[var(--line)] rounded-[6px] bg-[var(--paper)] p-7 sm:p-9 space-y-4 shadow-xs">
                <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[var(--sage)] block">
                  Core Rationale
                </span>
                <blockquote className="text-lg sm:text-xl font-serif font-semibold text-[var(--forest)] leading-relaxed italic border-l-2 border-[var(--forest)] pl-4">
                  &ldquo;{detail.pullQuote}&rdquo;
                </blockquote>
                <div className="pt-2 text-[11px] uppercase tracking-[0.12em] font-sans text-[var(--sage)]">
                  Celife Health Solutions · Mumbai Formulation Standard
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="my-16 md:my-24">
          <SectionDivider />
        </div>

        {/* 3. Active Composition Table (Real Semantic Table) */}
        <section className="py-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                Composition
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--ink)] tracking-tight">
              Active Bioactive Markers & Specifications
            </h2>
            <p className="text-xs sm:text-sm font-sans text-[var(--sage)] max-w-[65ch]">
              Standardized quantitative active assay per single administration unit.
            </p>
          </div>

          <CompositionTable
            caption={`${product.name} complete bioactive formulation breakdown`}
            rows={detail.composition}
            footnote={detail.excipientFootnote}
          />
        </section>

        {/* Section Divider */}
        <div className="my-16 md:my-24">
          <SectionDivider />
        </div>

        {/* 4. Targeted Action: Geometric SVG Node Diagram */}
        <section className="py-8">
          <ActiveNodeDiagram
            productName={product.name}
            actives={detail.activesMapping}
            targetSystem={detail.targetSystem}
            targetComponents={detail.targetComponents}
            supportStatements={detail.supportStatements}
          />
        </section>

        {/* Section Divider */}
        <div className="my-16 md:my-24">
          <SectionDivider />
        </div>

        {/* 5. Usage, Storage & Cautions (3-Column Hairline Panel) */}
        <section className="py-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)] tracking-tight">
              Usage & Administration Parameters
            </h3>
            <p className="text-xs sm:text-sm font-sans text-[var(--sage)]">
              Factual, practitioner-guided parameters for safe and effective administration.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-[var(--line)] rounded-[6px] bg-[var(--paper)] overflow-hidden">
            {/* Column 1: Suggested Use */}
            <div className="p-6 sm:p-7 border-b md:border-b-0 md:border-r border-[var(--line)] space-y-2.5">
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-bold text-[var(--forest)] block">
                Suggested Use
              </span>
              <p className="text-xs sm:text-sm font-sans text-[var(--ink)]/85 leading-relaxed">
                {detail.usage}
              </p>
            </div>

            {/* Column 2: Storage */}
            <div className="p-6 sm:p-7 border-b md:border-b-0 md:border-r border-[var(--line)] space-y-2.5">
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-bold text-[var(--forest)] block">
                Storage Environment
              </span>
              <p className="text-xs sm:text-sm font-sans text-[var(--ink)]/85 leading-relaxed">
                {detail.storage}
              </p>
            </div>

            {/* Column 3: Cautions */}
            <div className="p-6 sm:p-7 space-y-2.5 bg-[var(--bone)]/30">
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-bold text-[var(--clay)] block">
                Professional Cautions
              </span>
              <p className="text-xs sm:text-sm font-sans text-[var(--ink)]/85 leading-relaxed">
                {detail.cautions}
              </p>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        {relatedProducts.length > 0 && (
          <>
            <div className="my-16 md:my-24">
              <SectionDivider />
            </div>

            {/* 6. Related Formulations */}
            <section className="py-8 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                    Other Formulations
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--ink)] tracking-tight">
                    Related Therapeutic Portfolios
                  </h3>
                </div>
                <Link
                  href="/products"
                  className="text-xs uppercase tracking-[0.14em] font-semibold text-[var(--forest)] hover:underline"
                >
                  View All Formulations →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedProducts.map((rel) => (
                  <ProductCard key={rel.id} product={rel} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Section Divider */}
        <div className="my-16 md:my-24">
          <SectionDivider />
        </div>

        {/* 7. Product-Specific Enquiry Close Block */}
        <section className="py-4">
          <div className="border border-[var(--line)] rounded-[6px] bg-[var(--paper)] p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
                <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                  Direct Formulation Desk
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--ink)] tracking-tight">
                Enquire about {product.name}
              </h2>

              <p className="text-sm sm:text-base font-sans text-[var(--ink)]/80 leading-relaxed max-w-[55ch]">
                Submit your inquiry regarding clinic availability, batch certificates of analysis (CoA), or institutional supply. {product.name} is pre-selected on the enquiry form.
              </p>
            </div>

            <div className="shrink-0">
              <Button
                variant="primary"
                href={`/enquire?product=${product.slug}`}
                showArrow
                className="py-4 px-7"
              >
                Submit Formulation Enquiry
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
