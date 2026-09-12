import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Project from "@/models/Project";
import { requireAuth } from "@/lib/auth/require-auth";
import { createProjectSchema } from "@/lib/validations/project";
import { handleApiError } from "@/lib/error";

// POST /api/projects - Create Project (Protected: Admin/Editor)
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
    const parsed = createProjectSchema.parse(payload);

    await connectToDatabase();

    // 4. Verify unique slug conflict
    const existing = await Project.findOne({ slug: parsed.slug });
    if (existing) {
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

    // 5. Create project document
    const project = await Project.create({
      title: parsed.title,
      slug: parsed.slug,
      description: parsed.description,
      category: parsed.category,
      location: parsed.location,
      coverImage: parsed.coverImage,
      gallery: parsed.gallery,
      year: parsed.year,
      services: parsed.services,
      featured: parsed.featured || false,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: project._id.toString(),
          slug: project.slug,
        },
        message: "Project created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/projects - List all Projects (Public & Admin View)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const featured = searchParams.get("featured");

    await connectToDatabase();

    if (slug) {
      const project = await Project.findOne({ slug }).lean();
      if (!project) {
        return NextResponse.json(
          { success: false, error: "Project not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: project });
    }

    const query: { featured?: boolean } = {};
    if (featured === "true") {
      query.featured = true;
    }

    const projects = await Project.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return handleApiError(error);
  }
}
