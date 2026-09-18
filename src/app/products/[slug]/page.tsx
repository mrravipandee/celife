import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/services/products";
import { constructMetadata } from "@/config/seo";
import { siteConfig } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ProductDetailView } from "@/components/products/ProductDetailView";

// Incremental Static Regeneration (ISR): cached for 300s, purged on-demand when CMS updates
export const revalidate = 300;

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return constructMetadata({
      title: "Product Not Found",
      description: "The requested Celife product information could not be found.",
    });
  }

  const title = product.seo?.metaTitle || `${product.name} ${product.packSize ? `(${product.packSize})` : ""}`;
  const description = product.seo?.metaDescription || product.shortDescription || product.description;
  const image = product.images?.[0]?.url || product.image;

  return constructMetadata({
    title,
    description,
    image,
    canonical: `/products/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const [product, allProducts] = await Promise.all([
    getProductBySlug(slug),
    getProducts(),
  ]);

  if (!product) {
    notFound();
  }

  const relatedProducts = allProducts.filter((p) => p.slug !== product.slug).slice(0, 3);

  const primaryImageUrl = product.images?.[0]?.url || product.image;
  const absoluteImageUrl = primaryImageUrl?.startsWith("http")
    ? primaryImageUrl
    : `${siteConfig.url}${primaryImageUrl?.startsWith("/") ? "" : "/"}${primaryImageUrl || ""}`;

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: absoluteImageUrl,
    category: product.category,
    brand: {
      "@type": "Brand",
      name: product.brand || "CELIFE",
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/enquire?product=${product.slug}`,
      priceCurrency: "INR",
      price: "0",
      priceValidUntil: "2027-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <SmoothScroll>
        <Navbar />

        <main className="bg-[var(--bone)] text-[var(--ink)] min-h-screen">
          <ProductDetailView product={product} relatedProducts={relatedProducts} />
        </main>

        <Footer />
      </SmoothScroll>
    </>
  );
}
