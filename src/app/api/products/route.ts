import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
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

    const query: Record<string, unknown> = {};

    if (!isAdmin) {
      query.published = true;
    } else if (publishedParam !== null) {
      query.published = publishedParam === "true";
    }

    if (categoryParam) {
      query.category = categoryParam;
    }

    if (featuredParam !== null) {
      query.featured = featuredParam === "true";
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

    const products = await Product.find(query)
      .sort({ order: 1, createdAt: -1 })
      .lean();

    const formatted = (products as unknown as LeanProduct[]).map((p) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      subtitle: p.subtitle || "",
      category: p.category,
      shortDescription: p.shortDescription,
      description: p.description,
      formulation: p.formulation || "",
      form: p.form || "",
      packaging: p.packaging || "",
      wellnessFocus: p.wellnessFocus || "",
      usageAdvice: p.usageAdvice || "",
      keyFocus: p.keyFocus || [],
      highlights: p.highlights || [],
      image: p.image,
      gallery: p.gallery || [],
      featured: p.featured,
      published: p.published,
      order: p.order,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json(
      {
        success: true,
        data: formatted,
        count: formatted.length,
      },
      { status: 200 }
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
