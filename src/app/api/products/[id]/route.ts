import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Product, { IProduct } from "@/models/Product";
import Enquiry from "@/models/Enquiry";
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

    const product = await Product.findOne(query).lean<IProduct>();

    if (!product) {
      return NextResponse.json(
        { success: false, error: { message: "Product not found" } },
        { status: 404 }
      );
    }

    const isPublished = product.status === "published" || product.published === true;
    if (!isAdmin && !isPublished) {
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
          brand: product.brand || "CELIFE",
          productType: product.productType || "Health Supplement",
          format: product.format || "",
          dosageForm: product.dosageForm || "",
          therapeuticDomain: product.therapeuticDomain || "",
          subtitle: product.subtitle || "",
          category: product.category,
          categoryId: product.categoryId ? product.categoryId.toString() : null,
          shortDescription: product.shortDescription,
          description: product.description,
          fullDescription: product.fullDescription || product.description || "",
          aboutFormulation: product.aboutFormulation || "",
          scientificBackground: product.scientificBackground || "",
          coreRationale: product.coreRationale || "",
          packSize: product.packSize || "",
          flavour: product.flavour || "",
          netVolume: product.netVolume || "",
          sugarStatement: product.sugarStatement || "",
          ageStatement: product.ageStatement || "",
          productClassification: product.productClassification || "",
          formulation: product.formulation || "",
          form: product.form || "",
          packaging: product.packaging || "",
          wellnessFocus: product.wellnessFocus || "",
          usageAdvice: product.usageAdvice || "",
          recommendedUse: product.recommendedUse || product.recommendedUsage || product.usageAdvice || "",
          recommendedUsage: product.recommendedUsage || product.recommendedUse || product.usageAdvice || "",
          usageInstructions: product.usageInstructions || "",
          administrationNotes: product.administrationNotes || "",
          usageRules: product.usageRules || [],
          keyFocus: product.keyFocus || [],
          highlights: product.highlights || [],
          productTags: product.productTags || [],
          composition: product.composition || [],
          components: product.components || [],
          nutrition: product.nutrition || {},
          otherIngredients: product.otherIngredients || [],
          storageInstructions: product.storageInstructions || [],
          warnings: product.warnings || [],
          professionalCaution: product.professionalCaution || "",
          notes: product.notes || "",
          excipientStandard: product.excipientStandard || "",
          image: product.image,
          images: Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : [{ url: product.image, alt: product.name, type: "main", order: 1 }],
          gallery: product.gallery || [],
          status: product.status || (product.published ? "published" : "draft"),
          featured: product.featured ?? product.isFeatured ?? false,
          isFeatured: product.isFeatured ?? product.featured ?? false,
          published: product.published ?? (product.status === "published"),
          order: product.order ?? product.displayOrder ?? 0,
          displayOrder: product.displayOrder ?? product.order ?? 0,
          source: product.source || {
            sourceType: product.sourceType || "Product packaging",
            sourceReference: product.sourceNotes || "",
            verified: product.contentVerified ?? true,
            verifiedAt: null,
          },
          sourceType: product.sourceType || "Product packaging",
          sourceNotes: product.sourceNotes || "",
          contentVerified: product.contentVerified ?? true,
          seo: product.seo || {},
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

    // Synchronize status and published if either is sent
    const updateData: Record<string, unknown> = { ...parsed };
    if (parsed.status !== undefined && parsed.published === undefined) {
      updateData.published = parsed.status === "published";
    } else if (parsed.published !== undefined && parsed.status === undefined) {
      updateData.status = parsed.published ? "published" : "draft";
    }

    if (parsed.isFeatured !== undefined && parsed.featured === undefined) {
      updateData.featured = parsed.isFeatured;
    } else if (parsed.featured !== undefined && parsed.isFeatured === undefined) {
      updateData.isFeatured = parsed.featured;
    }

    if (parsed.displayOrder !== undefined && parsed.order === undefined) {
      updateData.order = parsed.displayOrder;
    } else if (parsed.order !== undefined && parsed.displayOrder === undefined) {
      updateData.displayOrder = parsed.order;
    }

    if (parsed.recommendedUse !== undefined && parsed.recommendedUsage === undefined) {
      updateData.recommendedUsage = parsed.recommendedUse;
    } else if (parsed.recommendedUsage !== undefined && parsed.recommendedUse === undefined) {
      updateData.recommendedUse = parsed.recommendedUsage;
    }

    if (parsed.source) {
      if (parsed.source.sourceType && parsed.sourceType === undefined) {
        updateData.sourceType = parsed.source.sourceType;
      }
      if (parsed.source.verified !== undefined && parsed.contentVerified === undefined) {
        updateData.contentVerified = Boolean(parsed.source.verified);
      }
    }

    const updated = await Product.findByIdAndUpdate(
      id,
      { $set: updateData },
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

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json(
        { success: false, error: { message: "Product not found" } },
        { status: 404 }
      );
    }

    // Referential Integrity Check: Verify whether inquiries exist referencing this product
    const enquiryCount = await Enquiry.countDocuments({
      $or: [
        { productId: product._id },
        { product: product.name },
        { product: product.slug },
      ],
    });

    if (enquiryCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: `Cannot permanently delete product "${product.name}" because ${enquiryCount} submitted customer enquiry record(s) reference it. Please unpublish or archive this product instead.`,
          },
        },
        { status: 409 }
      );
    }

    await Product.findByIdAndDelete(id);

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

