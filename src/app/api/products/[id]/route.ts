import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth/require-auth";
import { getSession } from "@/lib/auth/session";
import { productUpdateSchema } from "@/lib/validations/product";
import { handleApiError } from "@/lib/error";

// GET /api/products/[id] - by ID or slug
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getSession();
    const isAdmin = !!session;

    await connectToDatabase();

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const product = await Product.findOne(query).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: { message: "Product not found" } },
        { status: 404 }
      );
    }

    if (!isAdmin && !product.published) {
      return NextResponse.json(
        { success: false, error: { message: "Product not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: product._id.toString(),
          name: product.name,
          slug: product.slug,
          subtitle: product.subtitle || "",
          category: product.category,
          shortDescription: product.shortDescription,
          description: product.description,
          formulation: product.formulation || "",
          form: product.form || "",
          packaging: product.packaging || "",
          wellnessFocus: product.wellnessFocus || "",
          usageAdvice: product.usageAdvice || "",
          keyFocus: product.keyFocus || [],
          highlights: product.highlights || [],
          image: product.image,
          gallery: product.gallery || [],
          featured: product.featured,
          published: product.published,
          order: product.order,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/products/[id]
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: { message: "Malformed request body" } },
        { status: 400 }
      );
    }

    const parsed = productUpdateSchema.parse(payload);

    await connectToDatabase();

    if (parsed.slug) {
      const existing = await Product.findOne({
        slug: parsed.slug,
        _id: { $ne: id },
      });
      if (existing) {
        return NextResponse.json(
          { success: false, error: { message: "A product with this slug already exists" } },
          { status: 409 }
        );
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: parsed },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { message: "Product not found" } },
        { status: 404 }
      );
    }

    try {
      revalidatePath("/");
      revalidatePath("/products");
      revalidatePath(`/products/${updated.slug}`);
    } catch {
      // ignore
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updated._id.toString(),
          slug: updated.slug,
          name: updated.name,
        },
        message: "Product updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/products/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    await connectToDatabase();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: { message: "Product not found" } },
        { status: 404 }
      );
    }

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
        message: "Product deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
