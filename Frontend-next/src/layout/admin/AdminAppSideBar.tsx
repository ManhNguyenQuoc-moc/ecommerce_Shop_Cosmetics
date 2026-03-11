"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { adminNavItems } from "@/src/@core/http/routes/admin-nav";

export default function AdminAppSideBar() {
  const pathname = usePathname();

  return (
    <aside className="w-[240px] h-screen bg-slate-900 text-white flex flex-col">
      
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <span className="text-lg font-bold">Admin Panel</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {adminNavItems.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded-md text-sm transition
              ${
                active
                  ? "bg-white text-black"
                  : "text-gray-300 hover:bg-slate-800"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}