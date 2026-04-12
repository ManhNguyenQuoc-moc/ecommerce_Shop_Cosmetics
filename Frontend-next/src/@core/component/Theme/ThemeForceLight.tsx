"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Component này đảm bảo thẻ <html> luôn ở trạng thái light mode cho phía Customer.
 * Được sử dụng trong CustomerLayout để ngăn chặn việc rò rỉ Dark Mode từ phía Admin.
 */
export default function ThemeForceLight() {
  const pathname = usePathname();

  useEffect(() => {
    // Nếu không phải đường dẫn admin, ép buộc xóa class 'dark'
    if (!pathname.startsWith("/admin")) {
      document.documentElement.classList.remove("dark");
    }
  }, [pathname]);

  return null;
}
