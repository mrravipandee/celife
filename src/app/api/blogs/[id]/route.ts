import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import Blog from "@/models/Blog";
import { requireAuth, requireAdmin } from "@/lib/auth/require-auth";
import { updateBlogSchema } from "@/lib/validations/blog";
import { handleApiError } from "@/lib/error";
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

// Helper function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id);
}

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

// GET /api/blogs/[id] - Get Complete Blog Post (Protected: Admin/Editor)
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
            message: "Invalid blog ID",
          },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 3. Query Database
    const blog = await Blog.findById(id).lean();
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Blog not found",
          },
        },
        { status: 404 }
      );
    }

    const doc = blog as unknown as LeanBlogDetail;

    // 4. Transform response replacing _id with id
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
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
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

// PATCH /api/blogs/[id] - Update Blog Post (Protected: Admin/Editor)
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
            message: "Invalid blog ID",
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

    // 4. Validate partial data (throws on schema failure)
    const parsed = updateBlogSchema.parse(payload);

    await connectToDatabase();

    // 5. Query active document
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Blog not found",
          },
        },
        { status: 404 }
      );
    }

    // 6. Check unique slug conflict if modified
    if (parsed.slug && parsed.slug !== blog.slug) {
      const duplicate = await Blog.findOne({ slug: parsed.slug, _id: { $ne: id } });
      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            error: {
              message: "A blog with this slug already exists",
            },
          },
          { status: 409 }
        );
      }
    }

    // 7. Apply status changes and publishing logic
    if (parsed.status) {
      if (parsed.status === "published" && !blog.publishedAt && !parsed.publishedAt) {
        blog.publishedAt = new Date();
      }
      blog.status = parsed.status;
    }

    // Check if cover image is being replaced
    const oldPublicId = blog.coverImage?.publicId;
    const newPublicId = parsed.coverImage?.publicId;
    const isImageReplaced =
      parsed.coverImage &&
      newPublicId &&
      oldPublicId &&
      newPublicId !== oldPublicId;

    // 8. Apply remaining validated updates
    if (parsed.title) blog.title = parsed.title;
    if (parsed.slug) blog.slug = parsed.slug;
    if (parsed.excerpt) blog.excerpt = parsed.excerpt;
    if (parsed.content) blog.content = parsed.content;
    if (parsed.coverImage) blog.coverImage = parsed.coverImage;
    if (parsed.category) blog.category = parsed.category;
    if (parsed.tags) blog.tags = parsed.tags;
    if (parsed.author) blog.author = parsed.author;
    if (parsed.publishedAt) blog.publishedAt = parsed.publishedAt;
    if (parsed.readTime) blog.readTime = parsed.readTime;
    if (parsed.seo) blog.seo = parsed.seo;

    try {
      await blog.save();
    } catch (saveError) {
      // If DB update fails and we uploaded a new image, clean up new image
      if (newPublicId && newPublicId !== oldPublicId) {
        deleteImageFromCloudinary(newPublicId).catch((err) =>
          console.warn("Failed to cleanup orphaned new Cloudinary image:", err)
        );
      }
      throw saveError;
    }

    // If update succeeded and image was replaced, remove old Cloudinary asset
    if (isImageReplaced && oldPublicId) {
      deleteImageFromCloudinary(oldPublicId).catch((err) =>
        console.warn("Failed to delete old Cloudinary image:", err)
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: blog._id.toString(),
          slug: blog.slug,
          status: blog.status,
          publishedAt: blog.publishedAt,
        },
        message: "Blog updated successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE /api/blogs/[id] - Delete Blog Post (Protected: Admin Only)
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
            message: "Invalid blog ID",
          },
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // 3. Find document to check for cover image cleanup
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Blog not found",
          },
        },
        { status: 404 }
      );
    }

    const publicIdToDelete = blog.coverImage?.publicId;

    // 4. Delete document
    const result = await Blog.deleteOne({ _id: id });
    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Blog not found",
          },
        },
        { status: 404 }
      );
    }

    // 5. Clean up Cloudinary asset if one existed
    if (publicIdToDelete) {
      deleteImageFromCloudinary(publicIdToDelete).catch((err) =>
        console.warn("Failed to delete Cloudinary image upon blog deletion:", err)
      );
    }

    // 6. Return success
    return NextResponse.json(
      {
        success: true,
        message: "Blog deleted successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
