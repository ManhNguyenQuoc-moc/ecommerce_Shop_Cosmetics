import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/profile", "/admin", "/wishlist"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const userInfoCookie = request.cookies.get("user_info")?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // 1. Nếu vào route bảo vệ mà không có token -> Về login
  if (isProtected && !token) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // 2. Phân tích thông tin User từ Cookie
  let user: any = null;
  if (userInfoCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userInfoCookie));
    } catch (e) {
      console.error("Middleware: Cookie parse error");
    }
  }

  if (user?.is_banned && isProtected && pathname !== "/login") {
     const url = new URL("/login", request.url);
     url.searchParams.set("error", "banned");
     const response = NextResponse.redirect(url);
     return response;
  }

  if (pathname.startsWith("/admin")) {
    console.log("[MIDDLEWARE] Admin access check:", {
      pathname,
      hasCookie: !!userInfoCookie,
      user: user ? { id: user.id, role: user.role, email: user.email } : null,
    });
    if (!user || user.role !== "ADMIN") {
      console.log("[MIDDLEWARE] Admin denied - redirecting to home");
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

// Giữ nguyên config matcher
export const config = {
  matcher: [
    "/",
    "/profile/:path*",
    "/admin/:path*",
    "/wishlist/:path*",
    "/login" // Thêm login vào để xử lý redirect nếu cần
  ],
};