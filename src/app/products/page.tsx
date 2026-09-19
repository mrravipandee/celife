import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { getProducts, getProductCategories } from "@/lib/services/products";
import { ProductCatalogueClient } from "@/components/products/ProductCatalogueClient";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

// Incremental Static Regeneration (ISR): cached for 300s, purged on-demand when CMS content updates
export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "Product Catalogue | Celife Health Solutions",
  description:
    "Explore Celife Health Solutions' evidence-guided healthcare, nutraceutical, and botanical wellness formulation portfolio.",
});

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const currentCategory = params?.category || "all";

  const [allPublishedProducts, categoryNames] = await Promise.all([
    getProducts("all"),
    getProductCategories(),
  ]);

  const categories = [
    { label: "All Formulations", value: "all" },
    ...categoryNames.map((name) => ({ label: name, value: name })),
  ];

  return (
    <SmoothScroll>
      <Navbar />

      <main className="bg-[var(--bone)] text-[var(--ink)] min-h-screen pt-28 pb-20">
        {/* Editorial Page Header */}
        <section className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-10 md:py-16">
          <div className="max-w-3xl space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--clay)]" />
              <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[var(--forest)]">
                Our Formulation Portfolio
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-[var(--ink)] tracking-tight leading-[1.08]">
              Formulations Guided by Nature & Evidence
            </h1>

            <p className="text-sm sm:text-base font-sans text-[var(--sage)] leading-relaxed max-w-2xl font-light">
              Explore our portfolio of specialized nutraceutical and wellness formulations. Each formulation is calibrated for consistency, batch purity, and verified active specifications.
            </p>
          </div>

          {/* Interactive Dynamic Client Catalogue Component */}
          <ProductCatalogueClient
            initialProducts={allPublishedProducts}
            categories={categories}
            currentCategory={currentCategory}
          />
        </section>

        {/* Bottom Editorial Institutional Enquiry Callout */}
        <section className="max-w-[1380px] mx-auto px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 pt-6">
          <div className="bg-[var(--forest)] text-white rounded-[6px] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[var(--clay)]" />
                <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#C4D5C7]">
                  Medical & Institutional Enquiries
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                Require Institutional or Clinical Supply Information?
              </h2>
              <p className="text-xs sm:text-sm font-sans text-white/75 leading-relaxed">
                Connect directly with our healthcare advisory and formulation team for institutional procurement, certificates of analysis, and distribution enquiries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/enquire"
                className="px-8 py-4 bg-white text-[var(--forest)] hover:bg-[var(--bone)] text-xs uppercase tracking-[0.2em] font-semibold rounded-[4px] transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Make Product Enquiry</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </SmoothScroll>
  );
}
