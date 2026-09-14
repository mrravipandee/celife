import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/services/products";
import { productsData } from "@/data/products";
import { constructMetadata } from "@/config/seo";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/animations/SmoothScroll";
import { ProductDetailView } from "@/components/products/ProductDetailView";

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return productsData.map((product) => ({
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

  return constructMetadata({
    title: `${product.name} | Celife Health Solutions`,
    description: `${product.name} - ${product.shortDescription}`,
    image: product.image,
  });
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <SmoothScroll>
      <Navbar />
      <MobileMenu />

      <main className="bg-[#F8FAF6] text-[#171B18] min-h-screen pt-24 pb-16">
        <ProductDetailView product={product} />
      </main>

      <Footer />
    </SmoothScroll>
  );
}
