import { MetadataRoute } from "next";
import { getProducts } from "@/lib/services/products";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;

  const staticRoutes = ["", "/about", "/products", "/contact", "/enquire", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const products = await getProducts();
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    }));
    return [...staticRoutes, ...productRoutes];
  } catch (error) {
    console.error("Sitemap compilation product fetch failure:", error);
    return staticRoutes;
  }
}
