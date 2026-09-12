import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/error";

export async function POST() {
  try {
    await destroySession();
    return NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
