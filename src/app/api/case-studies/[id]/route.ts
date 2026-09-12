import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";
import { requireAuth, requireAdmin } from "@/lib/auth/require-auth";
import { updateCaseStudySchema } from "@/lib/validations/case-study";
import { handleApiError } from "@/lib/error";

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

interface LeanCaseStudyDetail {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  client: { name: string; industry?: string };
  location: string;
  propertyType: string;
  projectType: string;
  overview: string;
  challenge: string;
  solution: string;
  results: Array<{ metric: string; value: string; description?: string }>;
  services: string[];
  coverImage: { url: string; alt: string };
  gallery?: Array<{ url: string; alt: string }>;
  status: string;
  publishedAt?: Date;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
    canonicalUrl?: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

// GET /api/case-studies/[id] - Get Complete Case Study (Protected: Admin/Editor)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate user
    await requireAuth();

    const { id } = await params;

    // 2. Validate ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid case study ID",
          },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 3. Query Database
    const doc = await CaseStudy.findById(id).lean();
    if (!doc) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Case study not found",
          },
        },
        { status: 404 }
      );
    }

    const data = doc as unknown as LeanCaseStudyDetail;

    // 4. Transform response replacing _id with id
    const transformed = {
      id: data._id.toString(),
      title: data.title,
      slug: data.slug,
      client: data.client,
      location: data.location,
      propertyType: data.propertyType,
      projectType: data.projectType,
      overview: data.overview,
      challenge: data.challenge,
      solution: data.solution,
      results: data.results,
      services: data.services,
      coverImage: data.coverImage,
      gallery: data.gallery,
      status: data.status,
      publishedAt: data.publishedAt,
      seo: data.seo,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
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

// PATCH /api/case-studies/[id] - Update Case Study (Protected: Admin/Editor)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authenticate user
    await requireAuth();

    const { id } = await params;

    // 2. Validate ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid case study ID",
          },
        },
        { status: 400 }
      );
    }

    // 3. Parse request body
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

    // 4. Validate partial updates (throws on schema validation error)
    const parsed = updateCaseStudySchema.parse(payload);

    await connectToDatabase();

    // 5. Query active document
    const caseStudy = await CaseStudy.findById(id);
    if (!caseStudy) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Case study not found",
          },
        },
        { status: 404 }
      );
    }

    // 6. Check unique slug conflict if modified
    if (parsed.slug && parsed.slug !== caseStudy.slug) {
      const duplicate = await CaseStudy.findOne({ slug: parsed.slug, _id: { $ne: id } });
      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "A case study with this slug already exists",
            },
          },
          { status: 409 }
        );
      }
    }

    // 7. Apply status changes and publishing logic
    if (parsed.status) {
      if (parsed.status === "published" && !caseStudy.publishedAt && !parsed.publishedAt) {
        caseStudy.publishedAt = new Date();
      }
      caseStudy.status = parsed.status;
    }

    // 8. Apply remaining validated updates
    if (parsed.title) caseStudy.title = parsed.title;
    if (parsed.slug) caseStudy.slug = parsed.slug;
    if (parsed.client) caseStudy.client = parsed.client;
    if (parsed.location) caseStudy.location = parsed.location;
    if (parsed.propertyType) caseStudy.propertyType = parsed.propertyType;
    if (parsed.projectType) caseStudy.projectType = parsed.projectType;
    if (parsed.overview) caseStudy.overview = parsed.overview;
    if (parsed.challenge) caseStudy.challenge = parsed.challenge;
    if (parsed.solution) caseStudy.solution = parsed.solution;
    if (parsed.results) caseStudy.results = parsed.results;
    if (parsed.services) caseStudy.services = parsed.services;
    if (parsed.coverImage) caseStudy.coverImage = parsed.coverImage;
    if (parsed.gallery) caseStudy.gallery = parsed.gallery;
    if (parsed.publishedAt) caseStudy.publishedAt = parsed.publishedAt;
    if (parsed.seo) caseStudy.seo = parsed.seo;

    await caseStudy.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: caseStudy._id.toString(),
          slug: caseStudy.slug,
          status: caseStudy.status,
          publishedAt: caseStudy.publishedAt,
        },
        message: "Case study updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/case-studies/[id] - Delete Case Study (Protected: Admin Only)
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authorize Admin
    await requireAdmin();

    const { id } = await params;

    // 2. Validate ObjectId
    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid case study ID",
          },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 3. Delete document
    const result = await CaseStudy.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Case study not found",
          },
        },
        { status: 404 }
      );
    }

    // 4. Return success (do not return the deleted document)
    return NextResponse.json(
      {
        success: true,
        message: "Case study deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
