import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import ServiceModel from "@/models/Service";
import { requireAuth } from "@/lib/auth/require-auth";
import { getSession } from "@/lib/auth/session";
import { createServiceSchema } from "@/lib/validations/service";
import { handleApiError } from "@/lib/error";

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

// POST /api/services - Create Service (Protected: Admin/Editor)
export async function POST(req: Request) {
  try {
    // 1. Authenticate user
    await requireAuth();

    // 2. Parse request body
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

    // 3. Schema validation
    const parsed = createServiceSchema.parse(payload);

    await connectToDatabase();

    // 4. Verify unique slug conflict
    const existing = await ServiceModel.findOne({ slug: parsed.slug });
    if (existing) {
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

    // 5. Create service document
    const service = await ServiceModel.create({
      name: parsed.name,
      slug: parsed.slug,
      shortDescription: parsed.shortDescription,
      category: parsed.category,
      displayOrder: parsed.displayOrder,
      status: parsed.status || "draft",
      featured: parsed.featured || false,
      heroLabel: parsed.heroLabel,
      description: parsed.description,
      keyPoints: parsed.keyPoints,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: service._id.toString(),
          slug: service.slug,
          status: service.status,
        },
        message: "Service created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/services - List all Services (Public & Admin View)
export async function GET() {
  try {
    // Check if user has an active admin/editor session
    const session = await getSession();
    const isAdmin = !!session;

    await connectToDatabase();

    // Admin view gets all statuses; public gets only active
    const query = isAdmin ? {} : { status: "active" };

    // Fetch and sort services by displayOrder
    const services = await ServiceModel.find(query)
      .sort({ displayOrder: 1 })
      .lean();

    const transformed = (services as unknown as ServiceDoc[]).map((srv) => ({
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
    }));

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
