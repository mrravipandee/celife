import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const sessionCookie = req.cookies.get("thedco_session");

  // Protect /dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie || !sessionCookie.value) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect away from /login if already authenticated
  if (pathname === "/login") {
    if (sessionCookie && sessionCookie.value) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
