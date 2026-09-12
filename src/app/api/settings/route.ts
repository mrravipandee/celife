import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { requireAuth } from "@/lib/auth/require-auth";
import { handleApiError } from "@/lib/error";
import { settingsPatchSchema } from "@/lib/validations/settings";
import { siteConfig } from "@/config/site";

// ─── Default fallback values pulled from static siteConfig ───────────────────

function buildDefaults() {
  return {
    contact: {
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      address: siteConfig.contact.address,
      website: siteConfig.url,
    },
    social: {
      linkedin: siteConfig.socials.linkedin,
      instagram: siteConfig.socials.instagram,
      youtube: "",
      facebook: "",
    },
    notifications: {
      newInquiryEmail: true,
      weeklyDigest: false,
      systemAlerts: true,
    },
  };
}

// ─── GET /api/settings ────────────────────────────────────────────────────────

export async function GET() {
  try {
    await requireAuth();
    await connectToDatabase();

    const doc = await Settings.findOne({ _singleton: "main" }).lean();

    if (!doc) {
      // No document yet — return defaults without writing to DB
      return NextResponse.json(
        { success: true, data: { settings: buildDefaults() } },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          settings: {
            contact: doc.contact,
            social: doc.social,
            notifications: doc.notifications,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

// ─── PATCH /api/settings ──────────────────────────────────────────────────────

export async function PATCH(req: Request) {
  try {
    await requireAuth();
    await connectToDatabase();

    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: { message: "Malformed request body" } },
        { status: 400 }
      );
    }

    const parsed = settingsPatchSchema.parse(payload);

    // Build a dot-notation update object so we only overwrite supplied fields
    const updateFields: Record<string, unknown> = {};

    if (parsed.contact) {
      for (const [key, value] of Object.entries(parsed.contact)) {
        if (value !== undefined) {
          updateFields[`contact.${key}`] = value;
        }
      }
    }

    if (parsed.social) {
      for (const [key, value] of Object.entries(parsed.social)) {
        if (value !== undefined) {
          updateFields[`social.${key}`] = value;
        }
      }
    }

    if (parsed.notifications) {
      for (const [key, value] of Object.entries(parsed.notifications)) {
        if (value !== undefined) {
          updateFields[`notifications.${key}`] = value;
        }
      }
    }

    const updated = await Settings.findOneAndUpdate(
      { _singleton: "main" },
      { $set: updateFields },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json(
      {
        success: true,
        data: {
          settings: {
            contact: updated?.contact,
            social: updated?.social,
            notifications: updated?.notifications,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
