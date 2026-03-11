"use client";

import { Bell, User } from "lucide-react";

export default function AdminAppHeader() {
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-6">
      
      {/* Left */}
      <h1 className="font-semibold text-lg">
        Admin Dashboard
      </h1>

      {/* Right */}
      <div className="flex items-center gap-4">

        <button className="p-2 rounded-lg hover:bg-gray-100">
          <Bell size={20} />
        </button>

        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded-lg">
          <User size={20} />
          <span className="text-sm">Admin</span>
        </div>

      </div>
    </header>
  );
}