import { productsData } from "@/data/products";
import { Product } from "@/types/product";

export async function getProducts(category?: string): Promise<Product[]> {
  if (!category || category === "all") {
    return productsData;
  }
  return productsData.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = productsData.find((p) => p.slug === slug);
  return product || null;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return productsData.filter((p) => p.featured);
}

export function getProductCategories(): string[] {
  const categories = new Set(productsData.map((p) => p.category));
  return Array.from(categories);
}
