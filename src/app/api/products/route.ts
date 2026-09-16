import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { ensureDefaultProductsSeeded } from "@/lib/services/products";
import { requireAuth } from "@/lib/auth/require-auth";
import { getSession } from "@/lib/auth/session";
import { productCreateSchema } from "@/lib/validations/product";
import { handleApiError } from "@/lib/error";

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

interface LeanProduct {
  _id: { toString(): string };
  name: string;
  slug: string;
  subtitle?: string;
  category: string;
  shortDescription: string;
  description: string;
  formulation?: string;
  form?: string;
  packaging?: string;
  wellnessFocus?: string;
  usageAdvice?: string;
  keyFocus?: string[];
  highlights?: Array<{ label: string; value: string }>;
  image: string;
  gallery?: string[];
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/products
export async function GET(req: Request) {
  try {
    const session = await getSession();
    const isAdmin = !!session;

    const url = new URL(req.url);
    const categoryParam = url.searchParams.get("category");
    const searchParam = url.searchParams.get("search");
    const featuredParam = url.searchParams.get("featured");
    const publishedParam = url.searchParams.get("published");

    const statusParam = url.searchParams.get("status");

    const query: Record<string, unknown> = {};

    if (!isAdmin) {
      query.$or = [{ status: "published" }, { published: true }];
    } else if (statusParam && statusParam !== "all") {
      query.status = statusParam;
    } else if (publishedParam !== null) {
      query.published = publishedParam === "true";
    }

    if (categoryParam && categoryParam !== "all") {
      query.category = new RegExp(`^${escapeRegex(categoryParam)}$`, "i");
    }

    if (featuredParam !== null) {
      query.$or = [{ featured: featuredParam === "true" }, { isFeatured: featuredParam === "true" }];
    }

    if (searchParam) {
      const escaped = escapeRegex(searchParam.trim().substring(0, 50));
      if (escaped) {
        const regex = new RegExp(escaped, "i");
        query.$or = [
          { name: regex },
          { subtitle: regex },
          { shortDescription: regex },
          { formulation: regex },
          { wellnessFocus: regex },
        ];
      }
    }

    await connectToDatabase();
    await ensureDefaultProductsSeeded();

    const products = await Product.find(query)
      .sort({ displayOrder: 1, order: 1, createdAt: -1 })
      .lean();

    const formatted = products.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      brand: p.brand || "CELIFE",
      productType: p.productType || "Health Supplement",
      subtitle: p.subtitle || "",
      category: p.category,
      categoryId: p.categoryId ? p.categoryId.toString() : null,
      shortDescription: p.shortDescription,
      description: p.description,
      fullDescription: p.fullDescription || p.description || "",
      packSize: p.packSize || "",
      flavour: p.flavour || "",
      netVolume: p.netVolume || "",
      sugarStatement: p.sugarStatement || "",
      ageStatement: p.ageStatement || "",
      productClassification: p.productClassification || "",
      formulation: p.formulation || "",
      form: p.form || "",
      packaging: p.packaging || "",
      wellnessFocus: p.wellnessFocus || "",
      usageAdvice: p.usageAdvice || "",
      keyFocus: p.keyFocus || [],
      highlights: p.highlights || [],
      productTags: p.productTags || [],
      composition: p.composition || [],
      nutrition: p.nutrition || {},
      otherIngredients: p.otherIngredients || [],
      recommendedUsage: p.recommendedUsage || p.usageAdvice || "",
      storageInstructions: p.storageInstructions || [],
      warnings: p.warnings || [],
      image: p.image,
      images: Array.isArray(p.images) && p.images.length > 0
        ? p.images
        : [{ url: p.image, alt: p.name, type: "main", order: 1 }],
      gallery: p.gallery || [],
      status: p.status || (p.published ? "published" : "draft"),
      featured: p.featured ?? p.isFeatured ?? false,
      isFeatured: p.isFeatured ?? p.featured ?? false,
      published: p.published ?? (p.status === "published"),
      order: p.order ?? p.displayOrder ?? 0,
      displayOrder: p.displayOrder ?? p.order ?? 0,
      sourceType: p.sourceType || "Product packaging",
      sourceNotes: p.sourceNotes || "",
      contentVerified: p.contentVerified ?? true,
      seo: p.seo || {},
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formatted,
        count: formatted.length,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": isAdmin
            ? "private, no-cache, no-store, must-revalidate"
            : "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/products
export async function POST(req: Request) {
  try {
    await requireAuth();

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: { message: "Malformed request body" } },
        { status: 400 }
      );
    }

    const parsed = productCreateSchema.parse(payload);

    await connectToDatabase();

    const existing = await Product.findOne({ slug: parsed.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: "A product with this slug already exists" } },
        { status: 409 }
      );
    }

    const product = await Product.create(parsed);

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/products/${product.slug}`);
    } catch {
      // ignore
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: product._id.toString(),
          slug: product.slug,
          name: product.name,
        },
        message: "Product created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
