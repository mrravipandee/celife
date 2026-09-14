import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import Settings from "@/models/Settings";
import { requireAuth } from "@/lib/auth/require-auth";
import { handleApiError } from "@/lib/error";
import { settingsPatchSchema } from "@/lib/validations/settings";
import { siteConfig } from "@/config/site";

// ─── Default fallback values pulled from static siteConfig ───────────────────

function buildDefaults() {
  return {
    brand: {
      companyName: siteConfig.name,
      logo: "",
      favicon: "",
      tagline: "Targeted Botanical & Nutritional Wellness Formulations",
    },
    contact: {
      email: siteConfig.contact.email,
      phone: siteConfig.contact.phone,
      address: siteConfig.contact.address,
      website: siteConfig.url,
      whatsapp: siteConfig.contact.phone,
      businessHours: "Mon – Fri: 9:00 AM – 6:00 PM IST",
      googleMaps: "",
    },
    social: {
      linkedin: siteConfig.socials.linkedin,
      instagram: siteConfig.socials.instagram,
      youtube: "",
      facebook: "",
    },
    footer: {
      description: siteConfig.description,
      copyright: `© ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.`,
      disclaimer:
        "Information on this website is for educational and trade purposes and is not a substitute for professional medical advice.",
    },
    seo: {
      defaultTitle: siteConfig.title,
      defaultDescription: siteConfig.description,
      defaultOgImage: siteConfig.ogImage,
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
    // Note: We can allow public access or admin access. If admin is logged in, they get settings.
    // For dashboard consumption, auth is required:
    await requireAuth();
    await connectToDatabase();

    const doc = await Settings.findOne({ _singleton: "main" }).lean();

    if (!doc) {
      return NextResponse.json(
        { success: true, data: { settings: buildDefaults() } },
        { status: 200 }
      );
    }

    const defaults = buildDefaults();

    return NextResponse.json(
      {
        success: true,
        data: {
          settings: {
            brand: { ...defaults.brand, ...doc.brand },
            contact: { ...defaults.contact, ...doc.contact },
            social: { ...defaults.social, ...doc.social },
            footer: { ...defaults.footer, ...doc.footer },
            seo: { ...defaults.seo, ...doc.seo },
            notifications: { ...defaults.notifications, ...doc.notifications },
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

    const sections = ["brand", "contact", "social", "footer", "seo", "notifications"] as const;

    for (const section of sections) {
      const sectionData = parsed[section];
      if (sectionData) {
        for (const [key, value] of Object.entries(sectionData)) {
          if (value !== undefined) {
            updateFields[`${section}.${key}`] = value;
          }
        }
      }
    }

    const updated = await Settings.findOneAndUpdate(
      { _singleton: "main" },
      { $set: updateFields },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).lean();

    const defaults = buildDefaults();

    // Invalidate cached public pages
    try {
      revalidatePath("/");
      revalidatePath("/about");
      revalidatePath("/contact");
      revalidatePath("/products");
    } catch {
      // Revalidation failure shouldn't fail the API call
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          settings: {
            brand: { ...defaults.brand, ...updated?.brand },
            contact: { ...defaults.contact, ...updated?.contact },
            social: { ...defaults.social, ...updated?.social },
            footer: { ...defaults.footer, ...updated?.footer },
            seo: { ...defaults.seo, ...updated?.seo },
            notifications: { ...defaults.notifications, ...updated?.notifications },
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
