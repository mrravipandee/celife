import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import ProjectModel from "@/models/Project";
import { requireAuth, requireAdmin } from "@/lib/auth/require-auth";
import { updateProjectSchema } from "@/lib/validations/project";
import { handleApiError } from "@/lib/error";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

interface ProjectDoc {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  category: string;
  location: string;
  coverImage: string;
  gallery: string[];
  year: number;
  services: string[];
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// GET /api/projects/[id] - Get Complete Project Details (Protected)
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
            message: "Invalid project ID",
          },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const project = await ProjectModel.findById(id).lean();
    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Project not found",
          },
        },
        { status: 404 }
      );
    }

    const prj = project as unknown as ProjectDoc;
    const transformed = {
      id: prj._id.toString(),
      title: prj.title,
      slug: prj.slug,
      description: prj.description,
      category: prj.category,
      location: prj.location,
      coverImage: prj.coverImage,
      gallery: prj.gallery || [],
      year: prj.year,
      services: prj.services || [],
      featured: prj.featured || false,
      createdAt: prj.createdAt,
      updatedAt: prj.updatedAt,
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

// PATCH /api/projects/[id] - Update Project Details (Protected)
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
            message: "Invalid project ID",
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

    // Validate request data payload
    const parsed = updateProjectSchema.parse(payload);

    await connectToDatabase();

    const project = await ProjectModel.findById(id);
    if (!project) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Project not found",
          },
        },
        { status: 404 }
      );
    }

    // Verify slug conflict
    if (parsed.slug && parsed.slug !== project.slug) {
      const duplicate = await ProjectModel.findOne({ slug: parsed.slug, _id: { $ne: id } });
      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "A project with this slug already exists",
            },
          },
          { status: 409 }
        );
      }
    }

    // Apply updates
    if (parsed.title) project.title = parsed.title;
    if (parsed.slug) project.slug = parsed.slug;
    if (parsed.description) project.description = parsed.description;
    if (parsed.category) project.category = parsed.category;
    if (parsed.location) project.location = parsed.location;
    if (parsed.coverImage) project.coverImage = parsed.coverImage;
    if (parsed.gallery) project.gallery = parsed.gallery;
    if (parsed.year !== undefined) project.year = parsed.year;
    if (parsed.services) project.services = parsed.services;
    if (parsed.featured !== undefined) project.featured = parsed.featured;

    await project.save();

    return NextResponse.json(
      {
        success: true,
        data: {
          id: project._id.toString(),
          slug: project.slug,
        },
        message: "Project updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/projects/[id] - Delete Project (Protected: Admin Only)
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
            message: "Invalid project ID",
          },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const result = await ProjectModel.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Project not found",
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Project deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
