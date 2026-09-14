import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import PageContent from "@/models/PageContent";
import { requireAuth } from "@/lib/auth/require-auth";
import { getPageContent } from "@/lib/services/page-content";
import { pageContentUpdateSchema } from "@/lib/validations/page-content";
import { handleApiError } from "@/lib/error";

// GET /api/pages/[slug]
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const content = await getPageContent(slug as "homepage" | "about" | "quality");

    return NextResponse.json(
      {
        success: true,
        data: content,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT or PATCH /api/pages/[slug]
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  return handleUpdate(req, params);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  return handleUpdate(req, params);
}

async function handleUpdate(
  req: Request,
  paramsPromise: Promise<{ slug: string }>
) {
  try {
    await requireAuth();
    const { slug } = await paramsPromise;

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: { message: "Malformed request body" } },
        { status: 400 }
      );
    }

    const parsed = pageContentUpdateSchema.parse(payload);

    await connectToDatabase();

    const updated = await PageContent.findOneAndUpdate(
      { pageKey: slug },
      {
        $set: {
          sections: parsed.sections,
          ...(parsed.seo !== undefined && { seo: parsed.seo }),
          ...(parsed.published !== undefined && { published: parsed.published }),
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    // Trigger on-demand revalidation for the public page
    try {
      if (slug === "homepage") {
        revalidatePath("/");
      } else {
        revalidatePath(`/${slug}`);
      }
    } catch {
      // ignore
    }

    return NextResponse.json(
      {
        success: true,
        data: updated,
        message: `${slug.toUpperCase()} page content updated successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
