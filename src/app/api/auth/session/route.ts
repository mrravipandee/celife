import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { handleApiError } from "@/lib/error";

export async function GET() {
  try {
    const user = await getSession();

    if (!user) {
      return NextResponse.json(
        {
          success: true,
          data: {
            authenticated: false,
            user: null,
          },
        },
        { status: 200 }
      );
    }


    return NextResponse.json(
      {
        success: true,
        data: {
          authenticated: true,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return handleApiError(error);
  }
}
