"use client";

import React, { useState, useMemo } from "react";
import { BrandResponseDto } from "@/src/services/customer/customer.service";
import { CategoryResponseDto } from "@/src/services/models/category/output.dto";
import { useCustomerBrands } from "@/src/services/customer/brand.service";
import BrandCardMinimal from "./BrandCardMinimal";
import { Search, Sparkles } from "lucide-react";

interface BrandGridClientProps {
  brands: BrandResponseDto[];
  categories: CategoryResponseDto[];
}

export default function BrandGridClient({ brands: initialBrands, categories }: BrandGridClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState("");

  const { brands: apiBrands, isLoading } = useCustomerBrands(1, 100, undefined, selectedCategory, {
    fallbackData: initialBrands,
    revalidateOnFocus: false,
    revalidateOnMount: false,
  });
  const filteredBrands = useMemo(() => {
    if (!Array.isArray(apiBrands)) return [];
    return apiBrands.filter(brand =>
      brand.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [apiBrands, searchTerm]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col items-center justify-center gap-6">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-brand-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm thương hiệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-6 py-3 bg-white border-2 border-slate-200 rounded-2xl text-sm font-bold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all shadow-sm"
          />
        </div>
      </div>
      {Array.isArray(filteredBrands) && filteredBrands.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-8">
          {filteredBrands.map((brand) => (
            <BrandCardMinimal key={brand.id} brand={brand} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-white backdrop-blur-sm rounded-[3rem] border-2 border-dashed border-slate-200">
          <div className="inline-flex p-6 bg-slate-50 rounded-full mb-6">
            <Sparkles size={40} className="text-slate-300" />
          </div>
          <h3 className="text-2xl font-black text-slate-700 uppercase tracking-tight">Không tìm thấy thương hiệu</h3>
          <p className="text-slate-400 mt-2 font-medium">Thử nhập từ khóa khác hoặc xóa bộ lọc để tiếp tục.</p>
          <button
            onClick={() => { setSearchTerm(""); setSelectedCategory(undefined); }}
            className="mt-8 text-brand-600 font-black text-xs uppercase tracking-widest border-b-2 border-brand-500/20 hover:border-brand-500 transition-all pb-1"
          >
            Cài lại tìm kiếm
          </button>
        </div>
      )}
    </div>
  );
}
