import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/profile", "/admin", "/wishlist"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const userInfoCookie = request.cookies.get("user_info")?.value;
  
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 1. Check if token exists for protected routes
  if (!token && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. Block non-admin users from accessing /admin routes
  if (pathname.startsWith("/admin")) {
    try {
      if (userInfoCookie) {
        const decodedCookie = decodeURIComponent(userInfoCookie);
        const user = JSON.parse(decodedCookie);
        
        console.log("Proxy Check - Path:", pathname);
        console.log("Proxy Check - Role:", user.role);

        if (user.role !== "ADMIN") {
          console.log("Proxy Check - Access Denied (Not ADMIN)");
          return NextResponse.redirect(new URL("/login", request.url));
        }
      } else {
        console.log("Proxy Check - No user info cookie");
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch (error) {
      console.error("Proxy role check error:", error);
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/profile",
    "/admin/:path*",
    "/admin",
    "/wishlist/:path*",
    "/wishlist"
  ],
};
