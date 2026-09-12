import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Admin from "@/models/Admin";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { requireAuth } from "@/lib/auth/require-auth";
import { destroySession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/error";
import { changePasswordSchema } from "@/lib/validations/settings";

export async function POST(req: Request) {
  try {
    // 1. Verify active session
    const sessionUser = await requireAuth();

    // 2. Parse request body
    let payload: unknown;
    try {
      payload = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: { message: "Malformed request body" } },
        { status: 400 }
      );
    }

    // 3. Validate shape and confirm-password match
    const parsed = changePasswordSchema.parse(payload);
    const { currentPassword, newPassword } = parsed;

    await connectToDatabase();

    // 4. Load admin record (with passwordHash)
    const admin = await Admin.findById(sessionUser.id);
    if (!admin || !admin.isActive) {
      return NextResponse.json(
        { success: false, error: { message: "Account not found or inactive" } },
        { status: 404 }
      );
    }

    // 5. Verify current password against stored hash — server-side only
    const isCurrentPasswordCorrect = await verifyPassword(currentPassword, admin.passwordHash);
    if (!isCurrentPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          error: {
            field: "currentPassword",
            message: "Current password is incorrect",
          },
        },
        { status: 401 }
      );
    }

    // 6. Ensure the new password is different from the current one
    const isSamePassword = await verifyPassword(newPassword, admin.passwordHash);
    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          error: {
            field: "newPassword",
            message: "New password must be different from the current password",
          },
        },
        { status: 422 }
      );
    }

    // 7. Hash new password server-side using existing bcrypt utility (12 rounds)
    const newPasswordHash = await hashPassword(newPassword);

    // 8. Persist new hash — never log or return the hash
    admin.passwordHash = newPasswordHash;
    await admin.save();

    // 9. Destroy session — force re-login (stateless JWT; no revocation list)
    await destroySession();

    return NextResponse.json(
      {
        success: true,
        message: "Password changed successfully. Please sign in with your new password.",
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
