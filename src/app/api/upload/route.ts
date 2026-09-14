import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { requireAuth } from "@/lib/auth/require-auth";
import { handleApiError } from "@/lib/error";
import {
  isCloudinaryConfigured,
  validateImageBuffer,
  uploadImageToCloudinary,
} from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    await requireAuth();

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch {
      return NextResponse.json(
        { success: false, error: { message: "Malformed form data request." } },
        { status: 400 }
      );
    }

    const file = (formData.get("file") || formData.get("image")) as File | null;

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { success: false, error: { message: "No image file provided." } },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const validation = validateImageBuffer(buffer, file.type, file.name || "image");
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: { message: validation.error || "Invalid image file format." } },
        { status: 422 }
      );
    }

    // If Cloudinary is configured, upload to Cloudinary
    if (isCloudinaryConfigured()) {
      const uploadResult = await uploadImageToCloudinary(buffer, {
        folder: "celife/cms",
        tags: ["celife", "cms", "products"],
      });

      return NextResponse.json(
        {
          success: true,
          url: uploadResult.secureUrl || uploadResult.url,
          publicId: uploadResult.publicId,
          message: "Image uploaded successfully to Cloudinary",
        },
        { status: 200 }
      );
    }

    // Fallback: save to public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const ext = path.extname(file.name) || ".jpg";
    const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`;
    const filePath = path.join(uploadsDir, cleanName);

    await writeFile(filePath, buffer);
    const publicUrl = `/uploads/${cleanName}`;

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        message: "Image uploaded locally to public storage",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
