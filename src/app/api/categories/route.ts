import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProductCategory from "@/models/ProductCategory";
import { requireAuth } from "@/lib/auth/require-auth";
import { getSession } from "@/lib/auth/session";
import { categoryCreateSchema } from "@/lib/validations/category";
import { handleApiError } from "@/lib/error";

// GET /api/categories
export async function GET() {
  try {
    const session = await getSession();
    const isAdmin = !!session;

    await connectToDatabase();

    const query = isAdmin ? {} : { archived: { $ne: true } };

    const categories = await ProductCategory.find(query)
      .sort({ order: 1, name: 1 })
      .lean();

    interface LeanCategory {
      _id: { toString(): string };
      name: string;
      slug: string;
      tagline?: string;
      description?: string;
      order: number;
      archived: boolean;
      createdAt: Date;
      updatedAt: Date;
    }

    return NextResponse.json(
      {
        success: true,
        data: (categories as unknown as LeanCategory[]).map((c) => ({
          id: c._id.toString(),
          name: c.name,
          slug: c.slug,
          tagline: c.tagline || "",
          description: c.description || "",
          order: c.order,
          archived: c.archived,
          createdAt: c.createdAt,
          updatedAt: c.updatedAt,
        })),
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// POST /api/categories
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

    const parsed = categoryCreateSchema.parse(payload);

    await connectToDatabase();

    const existing = await ProductCategory.findOne({
      $or: [{ name: parsed.name }, { slug: parsed.slug }],
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: { message: "A category with this name or slug already exists" } },
        { status: 409 }
      );
    }

    const category = await ProductCategory.create(parsed);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: category._id.toString(),
          name: category.name,
          slug: category.slug,
        },
        message: "Category created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
