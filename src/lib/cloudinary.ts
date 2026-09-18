import "server-only";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Initialize Cloudinary SDK
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });
}

export interface CloudinaryUploadResult {
  url: string;
  secureUrl: string;
  publicId: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  transformation?: Record<string, unknown>[];
}

/**
 * Checks if Cloudinary is configured with all required environment variables.
 */
export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

/**
 * Validates image buffer using magic bytes signature and MIME type.
 * Max allowed size: 5MB.
 */
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

export function validateImageBuffer(
  buffer: Buffer,
  mimeType: string,
  fileName: string
): { isValid: boolean; error?: string } {
  if (!buffer || buffer.length === 0) {
    return { isValid: false, error: "Empty file provided." };
  }

  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed limit of ${MAX_FILE_SIZE_BYTES / (1024 * 1024)}MB.`,
    };
  }

  if (!ALLOWED_MIME_TYPES.includes(mimeType.toLowerCase())) {
    return {
      isValid: false,
      error: `Unsupported file type "${mimeType}". Allowed formats: JPG, PNG, WEBP, AVIF, GIF.`,
    };
  }

  // Validate magic bytes
  const hex = buffer.subarray(0, 16).toString("hex").toLowerCase();

  const isJpeg = hex.startsWith("ffd8ff");
  const isPng = hex.startsWith("89504e470d0a1a0a");
  const isGif = hex.startsWith("474946383761") || hex.startsWith("474946383961");
  const isWebp =
    hex.startsWith("52494646") &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP";
  const isAvif =
    buffer.subarray(4, 8).toString("ascii") === "ftyp" &&
    (buffer.subarray(8, 12).toString("ascii").includes("avif") ||
      buffer.subarray(8, 12).toString("ascii").includes("mif1"));

  if (!isJpeg && !isPng && !isGif && !isWebp && !isAvif) {
    // If MIME matches but magic bytes don't, reject spoofed files
    return {
      isValid: false,
      error: `Corrupt or invalid image format detected in ${fileName}.`,
    };
  }

  return { isValid: true };
}

/**
 * Uploads an image buffer to Cloudinary into the designated folder.
 */
export async function uploadImageToCloudinary(
  buffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary environment variables (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) are not configured."
    );
  }

  const folder = options.folder || "celife/blogs";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.publicId,
        tags: options.tags || ["blog-cover", "celife"],
        resource_type: "image",
        overwrite: true,
        // Auto-optimize delivery quality & format when accessed
        quality: "auto",
        fetch_format: "auto",
        transformation: options.transformation,
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error || !result) {
          console.error("Cloudinary upload stream error:", error);
          reject(new Error(error?.message || "Failed to upload image to Cloudinary"));
          return;
        }

        resolve({
          url: result.secure_url || result.url,
          secureUrl: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
          format: result.format,
          bytes: result.bytes,
        });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Deletes an image from Cloudinary by public ID.
 */
export async function deleteImageFromCloudinary(
  publicId: string
): Promise<{ result: string }> {
  if (!publicId || !isCloudinaryConfigured()) {
    return { result: "not_configured_or_empty" };
  }

  try {
    const res = await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
      invalidate: true,
    });
    return res;
  } catch (error) {
    console.warn(`Failed to delete Cloudinary image (${publicId}):`, error);
    return { result: "error" };
  }
}
