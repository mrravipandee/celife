import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { createEnquirySchema } from "@/lib/validations/enquiry";
import { paginationQuerySchema, searchQuerySchema } from "@/lib/validations/query";
import Enquiry from "@/models/Enquiry";
import { requireAuth } from "@/lib/auth/require-auth";
import { ENQUIRY_STATUSES } from "@/types/enquiry";
import { handleApiError } from "@/lib/error";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

function escapeRegex(text: string): string {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

interface LeanEnquiry {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  company?: string;
  projectType: string;
  location?: string;
  projectStage?: string;
  businessStatus?: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/enquiries - Public Form Submission (Rate Limited)
export async function POST(req: Request) {
  try {
    // 1. Enforce IP-based rate limit to protect against form spam
    const ip = await getClientIp();
    const rateLimitKey = `rate-limit:enquiry:${ip}`;
    const limitCheck = await checkRateLimit(rateLimitKey, 5, 10 * 60 * 1000); // 5 submissions per 10 mins
    if (!limitCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Too many enquiry submissions. Please try again later.",
          },
        },
        { status: 429 }
      );
    }

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

    // 3. Strict schema validation (rejects unknown fields via Zod strict schemas)
    const parsed = createEnquirySchema.parse(payload);

    await connectToDatabase();

    // 4. Save enquiry (assigns status = "new" implicitly via mongoose default)
    const enquiry = await Enquiry.create({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      company: parsed.company,
      projectType: parsed.projectType,
      location: parsed.location,
      projectStage: parsed.projectStage,
      businessStatus: parsed.businessStatus,
      message: parsed.message,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: enquiry._id.toString(),
        },
        message: "Enquiry submitted successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// GET /api/enquiries - List Submitted Enquiries (Protected: Admin/Editor)
export async function GET(req: Request) {
  try {
    // 1. Authenticate user
    await requireAuth();

    const url = new URL(req.url);
    const queryParams = Object.fromEntries(url.searchParams.entries());

    // 2. Validate page & limit bounds
    const { page, limit } = paginationQuerySchema.parse(queryParams);

    // 3. Validate status query parameter
    const statusParam = url.searchParams.get("status");
    if (statusParam && !ENQUIRY_STATUSES.includes(statusParam as (typeof ENQUIRY_STATUSES)[number])) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Invalid status filter value",
          },
        },
        { status: 422 }
      );
    }

    // 4. Validate search length
    const searchParam = url.searchParams.get("search");
    if (searchParam) {
      searchQuerySchema.parse(searchParam);
    }

    const query: {
      status?: string;
      $or?: Array<Record<string, RegExp>>;
    } = {};

    if (statusParam) {
      query.status = statusParam;
    }

    if (searchParam) {
      const truncated = searchParam.trim().substring(0, 50);
      if (truncated) {
        const escaped = escapeRegex(truncated);
        const searchRegex = new RegExp(escaped, "i");
        query.$or = [
          { name: searchRegex },
          { email: searchRegex },
          { company: searchRegex },
          { phone: searchRegex },
          { location: searchRegex },
        ];
      }
    }

    await connectToDatabase();

    const skip = (page - 1) * limit;

    const [total, enquiries] = await Promise.all([
      Enquiry.countDocuments(query),
      Enquiry.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const transformedEnquiries = (enquiries as unknown as LeanEnquiry[]).map((enquiry) => {
      return {
        id: enquiry._id.toString(),
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        company: enquiry.company,
        projectType: enquiry.projectType,
        location: enquiry.location,
        projectStage: enquiry.projectStage,
        businessStatus: enquiry.businessStatus,
        message: enquiry.message,
        status: enquiry.status,
        createdAt: enquiry.createdAt,
        updatedAt: enquiry.updatedAt,
      };
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        success: true,
        data: transformedEnquiries,
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
