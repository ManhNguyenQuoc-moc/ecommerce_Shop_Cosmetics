import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/profile", "/admin", "/wishlist"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const userInfoCookie = request.cookies.get("user_info")?.value;
  const hasSupabaseSession = request.cookies
    .getAll()
    .some((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"));
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // 1. Nếu vào route bảo vệ mà không có token -> Về login
  if (isProtected && !token && !hasSupabaseSession) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  // 2. Phân tích thông tin User từ Cookie
  let user: { id?: string; accountType?: "CUSTOMER" | "INTERNAL"; email?: string; is_banned?: boolean } | null = null;
  if (userInfoCookie) {
    try {
      user = JSON.parse(decodeURIComponent(userInfoCookie));
    } catch {
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
      user: user ? { id: user.id, accountType: user.accountType, email: user.email } : null,
    });
    if (!user || user.accountType !== "INTERNAL") {
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