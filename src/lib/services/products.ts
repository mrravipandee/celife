import { connectToDatabase } from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import ProductCategory, { IProductCategory } from "@/models/ProductCategory";
import { productsData } from "@/data/products";
import { Product as ProductType } from "@/types/product";

/**
 * Ensures initial Celife products and categories are seeded into MongoDB
 * if the collections are currently empty.
 */
export async function ensureDefaultProductsSeeded() {
  try {
    await connectToDatabase();
    const count = await Product.countDocuments();
    if (count === 0) {
      const docsToInsert = productsData.map((p, idx) => ({
        name: p.name,
        slug: p.slug,
        subtitle: p.subtitle,
        category: p.category,
        shortDescription: p.shortDescription,
        description: p.description,
        formulation: p.formulation,
        form: p.form,
        packaging: p.packaging,
        wellnessFocus: p.wellnessFocus,
        usageAdvice: p.usageAdvice,
        keyFocus: p.keyFocus,
        highlights: p.highlights,
        image: p.image,
        gallery: [],
        featured: Boolean(p.featured),
        published: true,
        order: idx,
      }));
      await Product.insertMany(docsToInsert);
    }

    const catCount = await ProductCategory.countDocuments();
    if (catCount === 0) {
      const categories = [
        { name: "Neurological Wellness", slug: "neurological-wellness", order: 0 },
        { name: "Joint & Mobility", slug: "joint-mobility", order: 1 },
        { name: "Hepatic Wellness", slug: "hepatic-wellness", order: 2 },
        { name: "Immune & Cellular", slug: "immune-cellular", order: 3 },
      ];
      await ProductCategory.insertMany(categories);
    }
  } catch (error) {
    // Non-blocking in serverless/build environments
    console.error("Product seeding notice:", error);
  }
}

function transformProduct(doc: IProduct): ProductType {
  return {
    id: doc._id?.toString() || doc.slug,
    slug: doc.slug,
    name: doc.name,
    subtitle: doc.subtitle || "",
    category: doc.category,
    shortDescription: doc.shortDescription,
    description: doc.description,
    formulation: doc.formulation || "",
    form: doc.form || "",
    packaging: doc.packaging || "",
    wellnessFocus: doc.wellnessFocus || "",
    usageAdvice: doc.usageAdvice || "",
    keyFocus: doc.keyFocus || [],
    highlights: doc.highlights || [],
    image: doc.image,
    featured: doc.featured,
    published: doc.published ?? true,
    order: doc.order ?? 0,
  };
}

export async function getProducts(category?: string): Promise<ProductType[]> {
  try {
    await connectToDatabase();
    await ensureDefaultProductsSeeded();

    const query: Record<string, unknown> = { published: true };
    if (category && category !== "all") {
      query.category = new RegExp(`^${category}$`, "i");
    }

    const products = await Product.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (products.length > 0) {
      return (products as unknown as IProduct[]).map(transformProduct);
    }
  } catch (error) {
    console.error("getProducts database fallback:", error);
  }

  // Fallback to static data
  if (!category || category === "all") {
    return productsData;
  }
  return productsData.filter(
    (p) => p.category.toLowerCase() === category.toLowerCase()
  );
}

export async function getProductBySlug(slug: string): Promise<ProductType | null> {
  try {
    await connectToDatabase();
    await ensureDefaultProductsSeeded();

    const product = await Product.findOne({ slug, published: true }).lean();
    if (product) {
      return transformProduct(product as unknown as IProduct);
    }
  } catch (error) {
    console.error("getProductBySlug database fallback:", error);
  }

  // Fallback to static data
  const fallback = productsData.find((p) => p.slug === slug);
  return fallback || null;
}

export async function getFeaturedProducts(): Promise<ProductType[]> {
  try {
    await connectToDatabase();
    await ensureDefaultProductsSeeded();

    const products = await Product.find({ published: true, featured: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    if (products.length > 0) {
      return (products as unknown as IProduct[]).map(transformProduct);
    }
  } catch (error) {
    console.error("getFeaturedProducts database fallback:", error);
  }

  return productsData.filter((p) => p.featured);
}

export async function getProductCategories(): Promise<string[]> {
  try {
    await connectToDatabase();
    await ensureDefaultProductsSeeded();

    const categories = await ProductCategory.find({ archived: { $ne: true } })
      .sort({ order: 1, name: 1 })
      .lean();

    if (categories.length > 0) {
      return (categories as unknown as IProductCategory[]).map((c) => c.name);
    }

    const distinct = await Product.distinct("category", { published: true });
    if (distinct.length > 0) {
      return distinct;
    }
  } catch (error) {
    console.error("getProductCategories database fallback:", error);
  }

  const set = new Set(productsData.map((p) => p.category));
  return Array.from(set);
}
