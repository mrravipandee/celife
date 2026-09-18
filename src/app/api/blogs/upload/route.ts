import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth/require-auth";
import { handleApiError } from "@/lib/error";
import {
  validateImageBuffer,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";

// POST /api/blogs/upload - Upload Blog Cover Image (Protected: Admin/Editor)
export async function POST(req: Request) {
  try {
    // 1. Enforce authentication
    await requireAuth();

    // 2. Extract multipart/form-data
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Malformed form data request.",
          },
        },
        { status: 400 }
      );
    }

    const file = (formData.get("file") || formData.get("image")) as File | null;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "No image file was uploaded. Please attach a file.",
          },
        },
        { status: 400 }
      );
    }

    // 3. Convert to buffer and validate file contents
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validation = validateImageBuffer(buffer, file.type, file.name || "image");
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: validation.error || "Invalid image file format.",
          },
        },
        { status: 422 }
      );
    }

    // 4. Upload buffer to Cloudinary in dedicated folder
    const uploadResult = await uploadImageToCloudinary(buffer, {
      folder: "celife/blogs",
      tags: ["blog", "cover", "celife"],
    });

    return NextResponse.json(
      {
        success: true,
        image: {
          url: uploadResult.secureUrl || uploadResult.url,
          publicId: uploadResult.publicId,
        },
        message: "Image uploaded successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
