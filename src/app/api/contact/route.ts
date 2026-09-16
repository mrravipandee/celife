import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import ContactMessage from "@/models/ContactMessage";
import { ContactFormSchema } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { handleApiError } from "@/lib/error";

export async function POST(req: Request) {
  try {
    // 1. Guard against unbounded request bodies (max 50KB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > 50 * 1024) {
      return NextResponse.json(
        { success: false, error: { message: "Payload exceeds 50KB limit." } },
        { status: 413 }
      );
    }

    // 2. IP-based rate limit against form spam
    const ip = await getClientIp();
    const rateLimitKey = `rate-limit:contact:${ip}`;
    const limitCheck = await checkRateLimit(rateLimitKey, 5, 10 * 60 * 1000);
    if (!limitCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            message: "Too many contact submissions. Please try again later.",
          },
        },
        { status: 429 }
      );
    }

    // 3. Parse request body safely
    let body: Record<string, unknown>;
    try {
      body = await req.json();
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

    // 4. Anti-bot honeypot check: silently discard bot spam
    if (body && (body._hp || body.honeypot || body.website_url)) {
      return NextResponse.json(
        {
          success: true,
          data: { id: "bot-discarded" },
          message: "Message sent successfully",
        },
        { status: 201 }
      );
    }

    // 5. Server-side validation
    const parsed = ContactFormSchema.parse(body);

    await connectToDatabase();

    const contact = await ContactMessage.create(parsed);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: contact._id.toString(),
        },
        message: "Message sent successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}

