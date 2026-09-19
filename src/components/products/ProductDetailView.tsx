"use client";

import React from "react";
import Link from "next/link";
import { Product, ProductImage } from "@/types/product";
import { ProductCard } from "@/components/products/ProductCard";
import { Button } from "@/components/ui/Button";
import { StickyMobileActionBar } from "@/components/products/StickyMobileActionBar";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { BotanicalMandala } from "@/components/ui/BotanicalMandala";
import { ArrowLeft, ShieldAlert, Sparkles, CheckCircle2, Flame, Layers } from "lucide-react";
import { ProductImageGallery } from "@/components/products/ProductImageGallery";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts?: Product[];
}

export function ProductDetailView({
  product,
  relatedProducts = [],
}: ProductDetailViewProps) {
  // Build structured specs from verified product fields only (omitting empty fields)
  const quickSpecs = [
    ...(product.brand ? [{ label: "Brand", value: product.brand }] : []),
    ...(product.productType ? [{ label: "Product Type", value: product.productType }] : []),
    ...(product.dosageForm ? [{ label: "Dosage Form", value: product.dosageForm }] : []),
    ...(product.format ? [{ label: "Format", value: product.format }] : []),
    ...(product.packSize ? [{ label: "Pack Presentation", value: product.packSize }] : []),
    ...(product.netVolume ? [{ label: "Net Volume", value: product.netVolume }] : []),
    ...(product.therapeuticDomain ? [{ label: "Therapeutic Domain", value: product.therapeuticDomain }] : []),
    ...(product.flavour ? [{ label: "Flavour Profile", value: product.flavour }] : []),
    ...(product.sugarStatement ? [{ label: "Sugar Profile", value: product.sugarStatement }] : []),
    ...(product.ageStatement ? [{ label: "Target Demographics", value: product.ageStatement }] : []),
    ...(product.productClassification ? [{ label: "Classification", value: product.productClassification }] : []),
  ];

  const galleryImages: ProductImage[] =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [{ url: product.image, alt: product.name, type: "main", order: 1 }]
      : [];

  const hasComponents = Boolean(product.components && product.components.length > 0);
  const hasComposition = Boolean(product.composition && product.composition.length > 0);

  // Group composition items if group field is present
  const compositionGroups = React.useMemo(() => {
    if (!product.composition || product.composition.length === 0) return null;
    const groups = new Map<string, typeof product.composition>();

    let hasAnyGroup = false;
    for (const item of product.composition) {
      const g = item.group?.trim() || "Active Constituents";
      if (item.group?.trim()) hasAnyGroup = true;
      if (!groups.has(g)) groups.set(g, []);
      groups.get(g)!.push(item);
    }

    return hasAnyGroup ? Array.from(groups.entries()) : null;
  }, [product]);

  const hasNutrition = Boolean(
    product.nutrition &&
      (product.nutrition.energy ||
        product.nutrition.fat ||
        product.nutrition.protein ||
        product.nutrition.carbohydrates ||
        product.nutrition.servingSize)
  );

  const hasOtherIngredients = Boolean(
    product.otherIngredients && product.otherIngredients.length > 0
  );

  const hasUsageRules = Boolean(
    product.usageRules && product.usageRules.length > 0
  );

  const hasUsage = Boolean(
    product.recommendedUse ||
      product.recommendedUsage ||
      product.usageInstructions ||
      product.usageAdvice ||
      hasUsageRules
  );

  const hasStorage = Boolean(
    product.storageInstructions && product.storageInstructions.length > 0
  );

  const hasWarnings = Boolean(
    (product.warnings && product.warnings.length > 0) ||
      product.professionalCaution
  );

  const hasEditorialSection = Boolean(
    product.aboutFormulation ||
      product.scientificBackground ||
      product.coreRationale ||
      product.description
  );

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
          className="mb-6 flex items-center gap-2 text-xs font-sans text-[var(--sage)] flex-wrap"
        >
          <Link href="/" className="hover:text-[var(--forest)] transition-colors">
            Home
          </Link>
          <span className="text-[var(--line)] font-bold">/</span>
          <Link href="/products" className="hover:text-[var(--forest)] transition-colors">
            Products
          </Link>
          <span className="text-[var(--line)] font-bold">/</span>
          <Link
            href={`/products?category=${encodeURIComponent(product.category)}`}
            className="hover:text-[var(--forest)] transition-colors"
          >
            {product.category}
          </Link>
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

        {/* SECTION 1: Product Hero (Gallery + Quick Specs) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column (6 cols): Sticky Product Image Gallery */}
          <div className="lg:col-span-6 lg:sticky lg:top-28 self-start">
            <ProductImageGallery
              images={galleryImages}
              primaryImage={product.image}
              productName={product.name}
            />
          </div>

          {/* Right Column (6 cols): Formulation Specs & Primary Enquiry */}
          <div className="lg:col-span-6 space-y-6">
            {/* Category Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)] shrink-0" />
              <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                {product.category}
              </span>
            </div>

            {/* Product Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-serif font-bold text-[var(--ink)] tracking-tight leading-[1.08]">
              {product.name}
            </h1>

            {/* Verified Short Description */}
            {(product.shortDescription || product.description) && (
              <p className="text-sm sm:text-base font-sans text-[var(--ink)]/80 leading-[1.65] max-w-[60ch] font-light">
                {product.shortDescription || product.description}
              </p>
            )}

            {/* Quick Specs Hairline Table (Only non-empty fields) */}
            {quickSpecs.length > 0 && (
              <div className="border border-[var(--line)] rounded-[6px] overflow-hidden bg-[var(--paper)]">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <caption className="sr-only">{product.name} specifications</caption>
                  <tbody className="divide-y divide-[var(--line)]/70">
                    {quickSpecs.map((spec, i) => (
                      <tr key={i} className="hover:bg-[var(--bone)]/40 transition-colors">
                        <th
                          scope="row"
                          className="py-3 px-4 sm:px-5 font-medium text-[var(--sage)] w-[40%] bg-[var(--bone)]/30 border-r border-[var(--line)]/70 text-[11px] uppercase tracking-wider"
                        >
                          {spec.label}
                        </th>
                        <td className="py-3 px-4 sm:px-5 font-medium text-[var(--ink)]">
                          {spec.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Excipient Standard Banner (if present) */}
            {product.excipientStandard && (
              <div className="p-4 bg-[var(--paper)] border border-[var(--line)] rounded-[6px] flex items-start gap-3">
                <CheckCircle2 size={16} className="text-[var(--forest)] shrink-0 mt-0.5" />
                <div className="space-y-0.5 text-xs font-sans">
                  <span className="font-semibold text-[var(--forest)] uppercase tracking-wider text-[10px] block">
                    Excipient Standard
                  </span>
                  <p className="text-[var(--ink)]/85">{product.excipientStandard}</p>
                </div>
              </div>
            )}

            {/* Primary Conversion CTA */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
              <Button
                variant="primary"
                href={`/enquire?product=${product.slug}`}
                showArrow
                className="py-4 px-8 text-center justify-center w-full"
              >
                Enquire About This Product
              </Button>
            </div>

            {/* Practitioner Advisory Footnote */}
            <p className="text-[12px] font-sans text-[var(--sage)] leading-relaxed pt-1 text-center sm:text-left font-light">
              Healthcare formulation for information, professional evaluation, and institutional supply.
            </p>
          </div>
        </div>

        {/* SECTION 2: About the Formulation & Scientific Background (Only if present) */}
        {hasEditorialSection && (
          <>
            <div className="my-16 md:my-20">
              <SectionDivider />
            </div>

            <section className="py-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--clay)]" />
                      <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                        Formulation Profile
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--ink)] tracking-tight">
                      About this formulation
                    </h2>
                  </div>

                  <div className="space-y-4 text-sm sm:text-base font-sans text-[var(--ink)]/80 leading-[1.7] max-w-[65ch] font-light">
                    {product.aboutFormulation && <p>{product.aboutFormulation}</p>}
                    {product.fullDescription && product.fullDescription !== product.aboutFormulation && (
                      <p>{product.fullDescription}</p>
                    )}
                    {product.scientificBackground && (
                      <div className="pt-3 border-t border-[var(--line)] space-y-2">
                        <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--forest)] block font-sans">
                          Scientific Background
                        </span>
                        <p>{product.scientificBackground}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Core Rationale Callout (if present) */}
                {product.coreRationale && (
                  <div className="lg:col-span-5">
                    <div className="border border-[var(--line)] rounded-[6px] bg-[var(--paper)] p-7 sm:p-9 space-y-4 shadow-xs">
                      <span className="text-[10px] uppercase tracking-[0.18em] font-bold text-[var(--sage)] block font-sans">
                        Formulation Rationale
                      </span>
                      <blockquote className="text-lg sm:text-xl font-serif font-semibold text-[var(--forest)] leading-relaxed italic border-l-2 border-[var(--forest)] pl-4">
                        &ldquo;{product.coreRationale}&rdquo;
                      </blockquote>
                      <div className="pt-2 text-[11px] uppercase tracking-[0.12em] font-sans text-[var(--sage)]">
                        Celife Health Solutions · Standardized Specification
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* SECTION 3: Multi-Component Formulations (e.g. BONIGO COMBO PACK) */}
        {hasComponents && (
          <>
            <div className="my-16 md:my-20">
              <SectionDivider />
            </div>

            <section className="py-4 space-y-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Layers size={14} className="text-[var(--clay)]" />
                  <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                    Multi-Pack Architecture
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--ink)] tracking-tight">
                  Component Formulations
                </h2>
                <p className="text-xs sm:text-sm font-sans text-[var(--sage)] max-w-2xl font-light">
                  This multi-component system provides separate specialized formulations designed to be administered in tandem.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {product.components!.map((comp, compIdx) => (
                  <div
                    key={compIdx}
                    className="border border-[var(--line)] rounded-[6px] bg-[var(--paper)] overflow-hidden shadow-xs space-y-4"
                  >
                    <div className="p-5 sm:p-6 bg-[var(--bone)]/50 border-b border-[var(--line)] flex items-start justify-between gap-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--forest)] block font-sans mb-1">
                          Component {String(compIdx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-[var(--ink)]">
                          {comp.name}
                        </h3>
                        {comp.description && (
                          <p className="text-xs font-sans text-[var(--sage)] mt-1 font-light">
                            {comp.description}
                          </p>
                        )}
                      </div>
                      {comp.composition && (
                        <span className="text-[11px] font-mono text-[var(--sage)] bg-[var(--paper)] px-2.5 py-1 border border-[var(--line)] rounded shrink-0">
                          {comp.composition.length} Actives
                        </span>
                      )}
                    </div>

                    {comp.composition && comp.composition.length > 0 && (
                      <div className="overflow-x-auto p-5 sm:p-6 pt-0">
                        <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
                          <thead>
                            <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--sage)] font-semibold">
                              <th className="py-2.5 px-3">Ingredient</th>
                              <th className="py-2.5 px-3 text-right">Quantity / Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--line)]/60">
                            {comp.composition.map((item, itemIdx) => (
                              <tr key={itemIdx} className="hover:bg-[var(--bone)]/40 transition-colors">
                                <td className="py-2.5 px-3 font-medium text-[var(--ink)]">
                                  {item.ingredient}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono text-xs tabular-nums text-[var(--ink)]/80">
                                  {item.amount !== null && item.amount !== undefined
                                    ? `${item.amount} ${item.unit || ""}`.trim()
                                    : item.quantity || "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* SECTION 4: Single-Component Composition & Nutrition Table */}
        {!hasComponents && hasComposition && (
          <>
            <div className="my-16 md:my-20">
              <SectionDivider />
            </div>

            <section className="py-4 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                {/* Left Col: Composition Table */}
                <div className={hasNutrition ? "lg:col-span-8 space-y-4" : "lg:col-span-12 space-y-4"}>
                  <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                    <div>
                      <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                        Active Formulation Profile
                      </span>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-serif font-bold text-[var(--ink)]">
                        Composition & RDA Breakdown
                      </h2>
                    </div>
                    <span className="text-[11px] font-mono text-[var(--sage)] bg-[var(--paper)] px-2.5 py-1 border border-[var(--line)] rounded">
                      {product.composition!.length} Actives
                    </span>
                  </div>

                  {product.nutrition?.servingSize && (
                    <p className="text-xs text-[var(--sage)] font-sans italic">
                      Values per serving: <strong className="text-[var(--ink)] not-italic">{product.nutrition.servingSize}</strong>
                    </p>
                  )}

                  {/* Grouped or Single Table */}
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
                          {compositionGroups
                            ? compositionGroups.map(([groupName, items], gIdx) => (
                                <React.Fragment key={gIdx}>
                                  <tr className="bg-[var(--bone)]/40">
                                    <td
                                      colSpan={3}
                                      className="py-2 px-4 sm:px-5 font-semibold text-[11px] uppercase tracking-wider text-[var(--forest)]"
                                    >
                                      {groupName}
                                    </td>
                                  </tr>
                                  {items.map((item, idx) => (
                                    <tr key={idx} className="hover:bg-[var(--bone)]/30 transition-colors">
                                      <td className="py-2.5 px-4 sm:px-5 font-medium text-[var(--ink)]">
                                        {item.ingredient}
                                        {item.note && (
                                          <span className="block text-[11px] text-[var(--sage)] font-normal italic">
                                            {item.note}
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-2.5 px-3 text-right font-mono text-xs tabular-nums text-[var(--ink)]/80">
                                        {item.amount !== null && item.amount !== undefined
                                          ? `${item.amount} ${item.unit || ""}`.trim()
                                          : item.quantity || "—"}
                                      </td>
                                      <td className="py-2.5 px-4 sm:px-5 text-right font-mono text-xs tabular-nums font-semibold text-[var(--forest)]">
                                        {item.rdaDisplay || (item.rdaPercentage !== null && item.rdaPercentage !== undefined ? `${item.rdaPercentage}%` : "#")}
                                      </td>
                                    </tr>
                                  ))}
                                </React.Fragment>
                              ))
                            : product.composition!.map((item, idx) => (
                                <tr key={idx} className="hover:bg-[var(--bone)]/40 transition-colors">
                                  <td className="py-3 px-4 sm:px-5 font-medium text-[var(--ink)]">
                                    {item.ingredient}
                                    {item.note && (
                                      <span className="block text-[11px] text-[var(--sage)] font-normal italic">
                                        {item.note}
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-3 px-3 text-right font-mono text-xs tabular-nums text-[var(--ink)]/80">
                                    {item.amount !== null && item.amount !== undefined
                                      ? `${item.amount} ${item.unit || ""}`.trim()
                                      : item.quantity || "—"}
                                  </td>
                                  <td className="py-3 px-4 sm:px-5 text-right font-mono text-xs tabular-nums font-semibold text-[var(--forest)]">
                                    {item.rdaDisplay || (item.rdaPercentage !== null && item.rdaPercentage !== undefined ? `${item.rdaPercentage}%` : "#")}
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="p-3 bg-[var(--bone)]/30 border-t border-[var(--line)] text-[11px] text-[var(--sage)] font-sans flex flex-wrap gap-y-1 gap-x-4">
                      <span>* % RDA based on ICMR / FSSAI guidelines for adult sedentary work.</span>
                      <span className="font-medium text-[var(--ink)]/80"># RDA not established or values as per formulation guidelines.</span>
                    </div>
                  </div>
                </div>

                {/* Right Col: Nutrition Facts Card (if present) */}
                {hasNutrition && (
                  <div className="lg:col-span-4 space-y-4">
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
                            <dt className="text-[var(--ink)] font-medium">Fat</dt>
                            <dd className="font-mono font-semibold tabular-nums text-[var(--ink)]">
                              {product.nutrition.fat}
                            </dd>
                          </div>
                        )}
                        {product.nutrition?.excipients && (
                          <div className="py-2.5 flex items-center justify-between">
                            <dt className="text-[var(--sage)]">Excipients</dt>
                            <dd className="font-mono tabular-nums text-[var(--sage)]">
                              {product.nutrition.excipients}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  </div>
                )}
              </div>

              {/* Other Ingredients (Excipients Tag Cloud) */}
              {hasOtherIngredients && (
                <div className="p-6 bg-[var(--paper)] border border-[var(--line)] rounded-[6px] space-y-3">
                  <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-bold text-[var(--forest)] block">
                    Other Ingredients & Excipients
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.otherIngredients!.map((item, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 bg-[var(--bone)] text-[var(--ink)] text-xs font-sans rounded border border-[var(--line)]/60 font-light"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* SECTION 5: Usage & Age-Graded Administration Rules */}
        {hasUsage && (
          <>
            <div className="my-16 md:my-20">
              <SectionDivider />
            </div>

            <section className="py-4 space-y-6">
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                  Administration Parameters
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--ink)] tracking-tight">
                  Recommended Usage & Directions
                </h2>
              </div>

              {/* Recommended Usage Wording */}
              {(product.recommendedUse || product.recommendedUsage || product.usageAdvice) && (
                <div className="p-6 bg-[var(--paper)] border border-[var(--line)] rounded-[6px] space-y-2">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-[var(--forest)] block font-sans">
                    Recommended Dosage
                  </span>
                  <p className="text-sm sm:text-base font-sans text-[var(--ink)]/85 leading-relaxed font-light">
                    {product.recommendedUse || product.recommendedUsage || product.usageAdvice}
                  </p>
                  {product.usageInstructions && (
                    <p className="text-xs sm:text-sm font-sans text-[var(--sage)] italic pt-1">
                      {product.usageInstructions}
                    </p>
                  )}
                </div>
              )}

              {/* Age-Graded Usage Rules Table */}
              {hasUsageRules && (
                <div className="border border-[var(--line)] rounded-[6px] overflow-hidden bg-[var(--paper)] shadow-xs">
                  <div className="p-4 bg-[var(--bone)]/50 border-b border-[var(--line)] font-semibold text-xs font-sans text-[var(--forest)] uppercase tracking-wider">
                    Age-Graded Administration Schedule
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs sm:text-sm font-sans">
                      <thead>
                        <tr className="bg-[var(--bone)]/30 border-b border-[var(--line)] text-[11px] uppercase tracking-wider text-[var(--sage)] font-semibold">
                          <th className="py-3 px-4 sm:px-5">Age Group</th>
                          <th className="py-3 px-4">Dosage</th>
                          <th className="py-3 px-4">Frequency</th>
                          <th className="py-3 px-4 sm:px-5">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--line)]/60">
                        {product.usageRules!.map((rule, rIdx) => (
                          <tr key={rIdx} className="hover:bg-[var(--bone)]/30 transition-colors">
                            <td className="py-3 px-4 sm:px-5 font-semibold text-[var(--ink)]">
                              {rule.ageGroup}
                            </td>
                            <td className="py-3 px-4 font-mono tabular-nums text-[var(--forest)] font-medium">
                              {rule.dosage}
                            </td>
                            <td className="py-3 px-4 text-[var(--ink)]/80">
                              {rule.frequency}
                            </td>
                            <td className="py-3 px-4 sm:px-5 text-[var(--sage)]">
                              {rule.instructions || "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {/* SECTION 6: Storage & Important Information (Warnings / Cautions) */}
        {(hasStorage || hasWarnings) && (
          <>
            <div className="my-16 md:my-20">
              <SectionDivider />
            </div>

            <section className="py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Storage Instructions */}
                {hasStorage && (
                  <div className="p-6 sm:p-7 border border-[var(--line)] rounded-[6px] bg-[var(--paper)] space-y-3">
                    <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-bold text-[var(--forest)] block">
                      Storage Environment
                    </span>
                    <ul className="space-y-1.5 text-xs sm:text-sm font-sans text-[var(--ink)]/85 list-disc pl-4 font-light">
                      {product.storageInstructions!.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Important Notes & Warnings */}
                {hasWarnings && (
                  <div className="p-6 sm:p-7 border border-[var(--line)] rounded-[6px] bg-[var(--paper)] space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldAlert size={16} className="text-[var(--clay)] shrink-0" />
                      <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-bold text-[var(--ink)] block">
                        Important Information & Safety Notes
                      </span>
                    </div>
                    {product.professionalCaution && (
                      <p className="text-xs sm:text-sm font-sans text-[var(--ink)]/90 font-medium">
                        {product.professionalCaution}
                      </p>
                    )}
                    {product.warnings && product.warnings.length > 0 && (
                      <ul className="space-y-1.5 text-xs sm:text-sm font-sans text-[var(--sage)] list-disc pl-4 font-light">
                        {product.warnings.map((warn, i) => (
                          <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* SECTION 7: Related Formulations */}
        {relatedProducts.length > 0 && (
          <>
            <div className="my-16 md:my-20">
              <SectionDivider />
            </div>

            <section className="py-4 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="space-y-2">
                  <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                    Other Formulations
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--ink)] tracking-tight">
                    Related Therapeutic Formulations
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

        {/* SECTION 8: Product-Specific Enquiry Close Block */}
        <div className="my-16 md:my-20">
          <SectionDivider />
        </div>

        <section className="py-4">
          <div className="relative overflow-hidden group border border-[var(--line)] rounded-[6px] bg-[var(--paper)] p-8 sm:p-12 lg:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xs">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-16 -right-16 sm:-top-20 sm:-right-20 md:-top-24 md:-right-24 w-60 h-60 sm:w-72 sm:h-72 md:w-84 md:h-84 text-[var(--forest)] opacity-20 select-none transition-transform duration-700 ease-out group-hover:scale-105 group-hover:rotate-6"
            >
              <BotanicalMandala />
            </div>

            <div className="space-y-3 max-w-xl relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--clay)]" />
                <span className="text-[11px] uppercase tracking-[0.16em] font-sans font-semibold text-[var(--sage)]">
                  Direct Formulation Desk
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[var(--ink)] tracking-tight">
                Enquire about {product.name}
              </h2>

              <p className="text-sm sm:text-base font-sans text-[var(--sage)] leading-relaxed max-w-[55ch] font-light">
                Submit an inquiry regarding batch availability, certificate of analysis (CoA), or clinical distribution. {product.name} is pre-selected on the enquiry form.
              </p>
            </div>

            <div className="shrink-0 relative z-10 w-full sm:w-auto">
              <Button
                variant="primary"
                href={`/enquire?product=${product.slug}`}
                showArrow
                className="py-4 px-8 w-full sm:w-auto justify-center"
              >
                Enquire About This Product
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
