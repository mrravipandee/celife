import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "./auth/require-auth";

/**
 * Centrally formats and handles API handler errors.
 * Never leaks database details, filesystem paths, or stack traces to clients.
 */
export function handleApiError(error: unknown) {
  // 1. Auth Errors
  if (error instanceof AuthError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error.message,
        },
      },
      { status: error.status }
    );
  }

  // 2. Zod Schema Validation Errors
  if (error instanceof ZodError) {
    const details: Record<string, string> = {};
    for (const issue of error.issues) {
      const path = issue.path.length > 0 ? issue.path.join(".") : "field";
      if (!details[path]) {
        details[path] = issue.message;
      }
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          message: "Validation failed",
          details,
        },
      },
      { status: 422 }
    );
  }

  // 3. MongoDB / Mongoose Duplicate Key Constraint Error
  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000
  ) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: "A resource with this unique property already exists",
        },
      },
      { status: 409 }
    );
  }

  // Log actual error server-side for internal debugging
  console.error("API handler execution error details:", error);

  // 4. Fallback Generic 500 Server Error
  return NextResponse.json(
    {
      success: false,
      error: {
        message: "Something went wrong",
      },
    },
    { status: 500 }
  );
}
