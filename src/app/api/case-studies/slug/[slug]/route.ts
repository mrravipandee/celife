import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import CaseStudy from "@/models/CaseStudy";
import { handleApiError } from "@/lib/error";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

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

// GET /api/case-studies/slug/[slug] - Get Published Case Study by Slug (Public)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // 1. Validate slug format
    if (!slug || !slugRegex.test(slug)) {
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

    await connectToDatabase();

    // 2. Query MongoDB, enforcing published status
    const doc = await CaseStudy.findOne({ slug, status: "published" }).lean();
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

    // 3. Transform response replacing _id with id and including results and SEO data
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
