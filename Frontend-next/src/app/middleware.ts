import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const protectedRoutes = ["/profile", "/orders", "/checkout", "/admin"];
export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}