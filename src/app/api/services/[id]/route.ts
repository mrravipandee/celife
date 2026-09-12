import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import ServiceModel from "@/models/Service";
import { requireAuth, requireAdmin } from "@/lib/auth/require-auth";
import { updateServiceSchema } from "@/lib/validations/service";
import { handleApiError } from "@/lib/error";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

interface ServiceDoc {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  shortDescription: string;
  category: string;
  displayOrder: number;
  status: "active" | "draft" | "hidden";
  featured: boolean;
  heroLabel: string;
  description: string;
  keyPoints: string[];
  updatedAt?: Date;
}

// GET /api/services/[id] - Get Complete Service Details (Protected)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid service ID",
          },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const service = await ServiceModel.findById(id).lean();
    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Service not found",
          },
        },
        { status: 404 }
      );
    }

    const srv = service as unknown as ServiceDoc;
    const transformed = {
      id: srv._id.toString(),
      name: srv.name,
      slug: srv.slug,
      shortDescription: srv.shortDescription,
      category: srv.category,
      displayOrder: srv.displayOrder,
      status: srv.status,
      featured: srv.featured,
      heroLabel: srv.heroLabel,
      description: srv.description,
      keyPoints: srv.keyPoints || [],
      updatedAt: srv.updatedAt
        ? new Date(srv.updatedAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        : "—",
    };

    return NextResponse.json(
      {
        success: true,
        data: transformed,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH /api/services/[id] - Update Service Details (Protected)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid service ID",
          },
        },
        { status: 400 }
      );
    }

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Malformed request body",
          },
        },
        { status: 400 }
      );
    }

    // Validate partial data payload
    const parsed = updateServiceSchema.parse(payload);

    await connectToDatabase();

    const service = await ServiceModel.findById(id);
    if (!service) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Service not found",
          },
        },
        { status: 404 }
      );
    }

    // Verify slug conflict
    if (parsed.slug && parsed.slug !== service.slug) {
      const duplicate = await ServiceModel.findOne({ slug: parsed.slug, _id: { $ne: id } });
      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "A service with this slug already exists",
            },
          },
          { status: 409 }
        );
      }
    }

    // Apply updates
    if (parsed.name) service.name = parsed.name;
    if (parsed.slug) service.slug = parsed.slug;
    if (parsed.shortDescription) service.shortDescription = parsed.shortDescription;
    if (parsed.category) service.category = parsed.category;
    if (parsed.displayOrder !== undefined) service.displayOrder = parsed.displayOrder;
    if (parsed.status) service.status = parsed.status;
    if (parsed.featured !== undefined) service.featured = parsed.featured;
    if (parsed.heroLabel) service.heroLabel = parsed.heroLabel;
    if (parsed.description) service.description = parsed.description;
    if (parsed.keyPoints) service.keyPoints = parsed.keyPoints;

    await service.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: service._id.toString(),
          slug: service.slug,
          status: service.status,
        },
        message: "Service updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/services/[id] - Delete Service (Protected: Admin Only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();

    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid service ID",
          },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const result = await ServiceModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Service not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Service deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
