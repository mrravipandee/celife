import React from "react";
import type { Metadata } from "next";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { getProducts, getProductCategories } from "@/lib/services/products";
import { ProductCard } from "@/components/products/ProductCard";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

// Incremental Static Regeneration (ISR): cached for 300s, purged on-demand when CMS content updates
export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "Product Catalogue | Celife Health Solutions",
  description:
    "Explore Celife Health Solutions' evidence-guided healthcare, nutraceutical, and botanical wellness formulations including Nervify Forte.",
});

interface ProductsPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const currentCategory = params?.category || "all";

  const [productsList, categoryNames] = await Promise.all([
    getProducts(currentCategory),
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
        <section className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ED1C24]" />
              <span className="text-xs uppercase tracking-[0.24em] font-sans font-semibold text-[#123C2D]">
                Celife Product Catalogue
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#171B18] tracking-tight leading-[1.08]">
              Formulations Guided by Nature & Evidence
            </h1>

            <p className="text-sm sm:text-base font-sans text-[#52635A] leading-relaxed max-w-2xl">
              Explore our portfolio of specialized nutraceutical and botanical wellness solutions. Each formulation is engineered for purity, verified bioavailability, and targeted physiological support.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-10 flex flex-wrap items-center gap-2.5 pt-6 border-t border-[#123C2D]/10">
            {categories.map((cat) => {
              const active =
                (currentCategory === "all" && cat.value === "all") ||
                currentCategory.toLowerCase() === cat.value.toLowerCase();

              return (
                <Link
                  key={cat.value}
                  href={cat.value === "all" ? "/products" : `/products?category=${encodeURIComponent(cat.value)}`}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-sans font-medium rounded-xs transition-all duration-200 ${
                    active
                      ? "bg-[#123C2D] text-white shadow-xs"
                      : "bg-white text-[#52635A] hover:text-[#123C2D] hover:bg-[#F4F5EF] border border-[#123C2D]/10"
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </div>
        </section>

        {/* Product Cards Grid */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {productsList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {productsList.length === 0 && (
            <div className="py-20 text-center bg-white border border-[#123C2D]/10 rounded-xs p-12 space-y-4">
              <p className="text-base text-[#52635A]">
                No formulations currently published in this category.
              </p>
              <Link
                href="/products"
                className="inline-block text-xs uppercase tracking-wider text-[#123C2D] font-semibold underline underline-offset-4"
              >
                View all formulations
              </Link>
            </div>
          )}
        </section>

        {/* Bottom Editorial Enquiry Callout */}
        <section className="max-w-7xl mx-auto px-6 md:px-12 pt-6">
          <div className="bg-[#123C2D] text-white rounded-xs p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#A87560]" />
                <span className="text-[10px] uppercase tracking-[0.24em] font-semibold text-[#C4D5C7]">
                  Medical & Distribution Enquiries
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white">
                Require Institutional or Custom Product Enquiries?
              </h2>
              <p className="text-xs sm:text-sm font-sans text-white/75 leading-relaxed">
                Connect directly with our healthcare advisory and formulation team for institutional procurement, clinical documentation, and wholesale distribution inquiries.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/enquire"
                className="px-8 py-4 bg-white text-[#123C2D] hover:bg-[#F4F5EF] text-xs uppercase tracking-[0.2em] font-semibold rounded-xs transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <span>Make General Enquiry</span>
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
