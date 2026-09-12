import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { handleApiError } from "@/lib/error";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

interface LeanBlogDetail {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: { url: string; alt: string };
  category: string;
  tags: string[];
  author: { name: string; id?: string };
  status: string;
  publishedAt?: Date;
  readTime: number;
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

// GET /api/blogs/slug/[slug] - Get Published Blog Post by Slug (Public)
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
            message: "Blog post not found",
          },
        },
        { status: 404 }
      );
    }

    await connectToDatabase();

    // 2. Query MongoDB, enforcing published status
    const blog = await Blog.findOne({ slug, status: "published" }).lean();
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Blog post not found",
          },
        },
        { status: 404 }
      );
    }

    const doc = blog as unknown as LeanBlogDetail;

    // 3. Transform response replacing _id with id and including SEO data
    const transformed = {
      id: doc._id.toString(),
      title: doc.title,
      slug: doc.slug,
      excerpt: doc.excerpt,
      content: doc.content,
      coverImage: doc.coverImage,
      category: doc.category,
      tags: doc.tags,
      author: doc.author,
      status: doc.status,
      publishedAt: doc.publishedAt,
      readTime: doc.readTime,
      seo: doc.seo,
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
