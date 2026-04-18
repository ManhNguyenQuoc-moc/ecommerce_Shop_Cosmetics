"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function HeaderSearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlSearchTerm = searchParams.get("searchTerm") || "";
  const [searchTerm, setSearchTerm] = useState(urlSearchTerm);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const params = new URLSearchParams();
      params.set("searchTerm", searchTerm.trim());
      router.push(`/products?${params.toString()}`);
    }
  };

  return (
    <>
      {/* Desktop Search - Hidden on mobile */}
      <div className="hidden md:flex flex-1 mx-2 relative group">
        <input
          key={`desktop-${urlSearchTerm}`}
          defaultValue={urlSearchTerm}
          placeholder="Tìm kiếm mỹ phẩm chính hãng..."
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full bg-white border border-brand-200/60 rounded-2xl px-5 py-2.5 pl-12 text-sm text-brand-900 placeholder:text-gray-400 outline-none focus:border-brand-500/70 focus:ring-4 focus:ring-brand-500/10 transition-all shadow-sm group-hover:border-brand-300"
        />
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors"
        />
      </div>

      {/* Mobile Search - renders inside header flex column (no extra padding) */}
      <div className="md:hidden w-full py-2.5 border-t border-brand-200/40">
        <div className="relative">
          <input
            key={`mobile-${urlSearchTerm}`}
            defaultValue={urlSearchTerm}
            placeholder="Tìm kiếm mỹ phẩm..."
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            className="w-full bg-white border border-brand-200/60 rounded-lg px-3 py-2.5 pl-10 text-sm text-brand-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-brand-500/30 shadow-sm"
          />
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </>
  );
}


