import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/profile", "/admin", "/wishtlist"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/profile",
    "/admin/:path*",
    "/admin",
    "/wishtlist/:path*",
    "/wishtlist"
  ],
};
