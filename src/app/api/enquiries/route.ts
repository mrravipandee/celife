import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { createEnquirySchema } from "@/lib/validations/enquiry";
import { paginationQuerySchema, searchQuerySchema } from "@/lib/validations/query";
import Enquiry from "@/models/Enquiry";
import Product from "@/models/Product";
import { requireAuth } from "@/lib/auth/require-auth";
import { ENQUIRY_STATUSES, EnquiryStatus } from "@/types/enquiry";
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
  productId?: mongoose.Types.ObjectId;
  productNameSnapshot?: string;
  productSlug?: string;
  productCategory?: string;
  product?: string;
  company?: string;
  city?: string;
  location?: string;
  projectType: string;
  projectStage?: string;
  businessStatus?: string;
  message: string;
  status: EnquiryStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// POST /api/enquiries - Public Form Submission (Rate Limited)
export async function POST(req: Request) {
  try {
    // 1. Guard against unbounded request bodies (max 50KB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 50 * 1024) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Payload exceeds 50KB limit.",
          },
        },
        { status: 413 }
      );
    }

    // 2. Enforce IP-based rate limit to protect against form spam
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

    // 3. Parse request body
    let payload: Record<string, unknown>;
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

    // 4. Anti-bot honeypot check: discard silent spam without touching MongoDB
    if (payload && (payload._hp || payload.honeypot || payload.website_url || payload.website)) {
      return NextResponse.json(
        {
          success: true,
          data: { id: "bot-discarded" },
          message: "Enquiry submitted successfully",
        },
        { status: 201 }
      );
    }

    // 5. Strict schema validation
    const parsed = createEnquirySchema.parse(payload);

    await connectToDatabase();

    // 6. Server-Side Product Validation
    // If productId or productSlug or product name is supplied, verify it exists and is published
    let validatedProductId: mongoose.Types.ObjectId | undefined;
    let validatedProductName: string | undefined;
    let validatedProductSlug: string | undefined;
    let validatedProductCategory: string | undefined;

    const candidateSlug = parsed.productSlug || (parsed.product && parsed.product.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    const candidateId = parsed.productId && mongoose.Types.ObjectId.isValid(parsed.productId) ? parsed.productId : undefined;

    if (candidateId || candidateSlug || parsed.product) {
      const productQuery: Record<string, unknown> = {
        $or: [
          ...(candidateId ? [{ _id: candidateId }] : []),
          ...(candidateSlug ? [{ slug: candidateSlug }] : []),
          ...(parsed.product ? [{ name: new RegExp(`^${escapeRegex(parsed.product)}$`, "i") }] : []),
        ],
      };

      const productDoc = await Product.findOne(productQuery).lean();

      if (productDoc) {
        // Enforce published status (prevent enquiry against draft products)
        const isPublished = productDoc.status === "published" || (productDoc.published === true && productDoc.status !== "draft");
        if (!isPublished) {
          return NextResponse.json(
            {
              success: false,
              error: {
                message: "The requested formulation is currently not available for public enquiry.",
              },
            },
            { status: 400 }
          );
        }

        validatedProductId = productDoc._id;
        validatedProductName = productDoc.name;
        validatedProductSlug = productDoc.slug;
        validatedProductCategory = productDoc.category;
      } else if (candidateId || candidateSlug) {
        // If an explicit ID or slug was given and not found in published products
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "The selected formulation could not be verified in our portfolio.",
            },
          },
          { status: 400 }
        );
      }
    }

    // 7. Save enquiry (assigns status = "new" implicitly via mongoose default, notes = "")
    const enquiry = await Enquiry.create({
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      productId: validatedProductId,
      productNameSnapshot: validatedProductName || parsed.productNameSnapshot || parsed.product || undefined,
      productSlug: validatedProductSlug || parsed.productSlug || undefined,
      productCategory: validatedProductCategory || parsed.productCategory || undefined,
      product: validatedProductName || parsed.product || undefined,
      company: parsed.company || undefined,
      city: parsed.city || parsed.location || undefined,
      location: parsed.location || parsed.city || undefined,
      projectType: parsed.projectType || "Product Enquiry",
      projectStage: parsed.projectStage || undefined,
      businessStatus: parsed.businessStatus || undefined,
      message: parsed.message,
      status: "new",
      notes: "",
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
    if (statusParam && statusParam !== "all" && !ENQUIRY_STATUSES.includes(statusParam as (typeof ENQUIRY_STATUSES)[number])) {
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
      productSlug?: string;
      $or?: Array<Record<string, RegExp>>;
    } = {};

    if (statusParam && statusParam !== "all") {
      query.status = statusParam;
    }

    const productParam = url.searchParams.get("productSlug") || url.searchParams.get("product");
    if (productParam && productParam !== "all") {
      query.productSlug = productParam;
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
          { city: searchRegex },
          { location: searchRegex },
          { product: searchRegex },
          { productNameSnapshot: searchRegex },
          { productSlug: searchRegex },
        ];
      }
    }

    await connectToDatabase();

    const skip = (page - 1) * limit;

    const [total, enquiries] = await Promise.all([
      Enquiry.countDocuments(query),
      Enquiry.find(query)
        .select("name email phone productId productNameSnapshot productSlug productCategory product company city location projectType projectStage businessStatus message status notes createdAt updatedAt")
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
        productId: enquiry.productId ? enquiry.productId.toString() : undefined,
        productNameSnapshot: enquiry.productNameSnapshot,
        productSlug: enquiry.productSlug,
        productCategory: enquiry.productCategory,
        product: enquiry.productNameSnapshot || enquiry.product,
        company: enquiry.company,
        city: enquiry.city || enquiry.location,
        location: enquiry.location || enquiry.city,
        projectType: enquiry.projectType,
        projectStage: enquiry.projectStage,
        businessStatus: enquiry.businessStatus,
        message: enquiry.message,
        status: enquiry.status,
        notes: enquiry.notes || "",
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
