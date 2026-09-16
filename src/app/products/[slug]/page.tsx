import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts } from "@/lib/services/products";
import { productsData } from "@/data/products";
import { constructMetadata } from "@/config/seo";
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
      title: "Product Not Found | Celife",
      description: "The requested Celife product information could not be found.",
    });
  }

  const title = product.seo?.metaTitle || `${product.name} | Celife Health Solutions`;
  const description = product.seo?.metaDescription || `${product.name} - ${product.shortDescription}`;
  const image = product.images?.[0]?.url || product.image;

  return constructMetadata({
    title,
    description,
    image,
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

  return (
    <SmoothScroll>
      <Navbar />

      <main className="bg-[var(--bone)] text-[var(--ink)] min-h-screen">
        <ProductDetailView product={product} relatedProducts={relatedProducts} />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
