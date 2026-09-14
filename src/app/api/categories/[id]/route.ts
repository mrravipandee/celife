import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ProductCategory from "@/models/ProductCategory";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth/require-auth";
import { categoryUpdateSchema } from "@/lib/validations/category";
import { handleApiError } from "@/lib/error";

// PATCH /api/categories/[id]
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

    const parsed = categoryUpdateSchema.parse(payload);

    await connectToDatabase();

    if (parsed.name || parsed.slug) {
      const orConditions = [];
      if (parsed.name) orConditions.push({ name: parsed.name });
      if (parsed.slug) orConditions.push({ slug: parsed.slug });

      const existing = await ProductCategory.findOne({
        $or: orConditions,
        _id: { $ne: id },
      });

      if (existing) {
        return NextResponse.json(
          { success: false, error: { message: "Another category with this name or slug already exists" } },
          { status: 409 }
        );
      }
    }

    const updated = await ProductCategory.findByIdAndUpdate(
      id,
      { $set: parsed },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return NextResponse.json(
        { success: false, error: { message: "Category not found" } },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: updated._id.toString(),
          name: updated.name,
          slug: updated.slug,
          archived: updated.archived,
        },
        message: "Category updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/categories/[id]
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;

    await connectToDatabase();

    const category = await ProductCategory.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: { message: "Category not found" } },
        { status: 404 }
      );
    }

    // Check if any products use this category
    const productsCount = await Product.countDocuments({
      category: { $in: [category.name, category.slug] },
    });

    if (productsCount > 0) {
      // Soft-archive instead of hard deleting to prevent breaking products
      category.archived = true;
      await category.save();

      return NextResponse.json(
        {
          success: true,
          message: `Category has ${productsCount} product(s) assigned, so it was archived rather than deleted.`,
        },
        { status: 200 }
      );
    }

    await ProductCategory.findByIdAndDelete(id);

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
