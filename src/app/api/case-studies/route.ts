import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";
import { requireAuth } from "@/lib/auth/require-auth";
import { getSession } from "@/lib/auth/session";
import { createCaseStudySchema } from "@/lib/validations/case-study";
import { paginationQuerySchema, searchQuerySchema } from "@/lib/validations/query";
import {
  CASE_STUDY_STATUSES,
  PROPERTY_TYPES,
  CASE_STUDY_PROJECT_TYPES,
} from "@/types/case-study";
import { handleApiError } from "@/lib/error";

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

interface LeanCaseStudyList {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  client: { name: string; industry?: string };
  location: string;
  propertyType: string;
  projectType: string;
  coverImage: { url: string; alt: string };
  services: string[];
  status: string;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/case-studies - Create Case Study (Protected: Admin/Editor)
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

    // 3. Strict schema validation (Zod throws error if invalid/unknown fields)
    const parsed = createCaseStudySchema.parse(payload);

    await connectToDatabase();

    // 4. Verify slug uniqueness
    const existing = await CaseStudy.findOne({ slug: parsed.slug });
    if (existing) {
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

    // 5. Apply publishing date logic
    let publishedAt = parsed.publishedAt;
    if (parsed.status === "published" && !publishedAt) {
      publishedAt = new Date();
    }

    // 6. Create Case Study
    const caseStudy = await CaseStudy.create({
      title: parsed.title,
      slug: parsed.slug,
      client: parsed.client,
      location: parsed.location,
      propertyType: parsed.propertyType,
      projectType: parsed.projectType,
      overview: parsed.overview,
      challenge: parsed.challenge,
      solution: parsed.solution,
      results: parsed.results,
      services: parsed.services,
      coverImage: parsed.coverImage,
      gallery: parsed.gallery,
      status: parsed.status,
      publishedAt,
      seo: parsed.seo,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: caseStudy._id.toString(),
          slug: caseStudy.slug,
          status: caseStudy.status,
        },
        message: "Case study created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/case-studies - List Case Studies (Public & CMS Admin)
export async function GET(req: Request) {
  try {
    // 1. Check if user is authenticated for Admin view
    const session = await getSession();
    const isAdmin = !!session;

    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // 2. Validate page & limit bounds
    const { page, limit } = paginationQuerySchema.parse(queryParams);

    const statusParam = url.searchParams.get("status");
    const propertyTypeParam = url.searchParams.get("propertyType");
    const projectTypeParam = url.searchParams.get("projectType");
    const locationParam = url.searchParams.get("location");
    const searchParam = url.searchParams.get("search");

    // Build DB Query conditions
    const query: {
      status?: string;
      propertyType?: string;
      projectType?: string;
      location?: RegExp;
      $or?: Array<Record<string, RegExp>>;
    } = {};

    // 3. Enforce visibility permissions (public sees only published)
    if (!isAdmin) {
      query.status = "published";
    } else if (statusParam) {
      // Validate status query parameter
      if (!CASE_STUDY_STATUSES.includes(statusParam as (typeof CASE_STUDY_STATUSES)[number])) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Invalid status query value",
            },
          },
          { status: 422 }
        );
      }
      query.status = statusParam;
    }

    // 4. Property Type Filter
    if (propertyTypeParam) {
      if (!PROPERTY_TYPES.includes(propertyTypeParam as (typeof PROPERTY_TYPES)[number])) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Invalid propertyType query value",
            },
          },
          { status: 422 }
        );
      }
      query.propertyType = propertyTypeParam;
    }

    // 5. Project Type Filter
    if (projectTypeParam) {
      if (!CASE_STUDY_PROJECT_TYPES.includes(projectTypeParam as (typeof CASE_STUDY_PROJECT_TYPES)[number])) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "Invalid projectType query value",
            },
          },
          { status: 422 }
        );
      }
      query.projectType = projectTypeParam;
    }

    // 6. Location Filter
    if (locationParam) {
      const escapedLoc = escapeRegex(locationParam.trim().substring(0, 100));
      if (escapedLoc) {
        query.location = new RegExp(escapedLoc, "i");
      }
    }

    // 7. Validate search length
    if (searchParam) {
      searchQuerySchema.parse(searchParam);
      const truncated = searchParam.trim().substring(0, 50);
      if (truncated) {
        const escaped = escapeRegex(truncated);
        const searchRegex = new RegExp(escaped, "i");
        query.$or = [
          { title: searchRegex },
          { "client.name": searchRegex },
          { location: searchRegex },
          { propertyType: searchRegex },
          { projectType: searchRegex },
          { services: searchRegex },
        ];
      }
    }

    await connectToDatabase();

    const skip = (page - 1) * limit;

    // Sorting: publishedAt desc (for public) or createdAt desc (for admin lists)
    const sortOption: Record<string, 1 | -1> = !isAdmin
      ? { publishedAt: -1 }
      : { createdAt: -1 };

    // Fetch lightweight list omitting the complete case study detail fields
    const [total, caseStudies] = await Promise.all([
      CaseStudy.countDocuments(query),
      CaseStudy.find(query)
        .select("-overview -challenge -solution")
        .sort(sortOption)
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const transformed = (caseStudies as unknown as LeanCaseStudyList[]).map((doc) => {
      return {
        id: doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        client: doc.client,
        location: doc.location,
        propertyType: doc.propertyType,
        projectType: doc.projectType,
        coverImage: doc.coverImage,
        services: doc.services,
        status: doc.status,
        publishedAt: doc.publishedAt,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: transformed,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
