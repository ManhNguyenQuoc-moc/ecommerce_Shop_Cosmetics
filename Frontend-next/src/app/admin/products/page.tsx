"use client";

import React from 'react';
import ProductFilters from "./components/ProductFilters";
import ProductTable from "./components/ProductTable";
import { Info, Package } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

export default function ProductsPage() {
  useSWTTitle("Quản Lý Sản Phẩm | Admin");
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Products" }
          ]} />
          <div className="relative mt-2 overflow-hidden bg-gradient-to-r from-brand-500 to-rose-600 text-white px-5 py-2.5 rounded-tl-xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-lg shadow-brand-500/40 border border-white/20 flex items-center gap-3 w-fit group/title cursor-default mt-3 mb-2">
            <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-sweep" />
            <Package size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />
            <h2 className="!mb-0 text-2xl font-black tracking-tight drop-shadow-md whitespace-nowrap">
              Quản lý Sản phẩm
            </h2>
          </div>
          <p className="text-brand-500 dark:text-cyan-400 text-sm font-semibold uppercase tracking-widest drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">
            Xem, thêm mới và quản lý thông tin các sản phẩm trong kho.
          </p>
        </div>

        <SWTTooltip
          title={<span className="text-sm">Quản lý danh lục sản phẩm, giá bán và phân loại danh mục.</span>}
          placement="left"
          color="indigo"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-indigo-50 hover:bg-indigo-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-xl cursor-help transition-all shadow-sm border border-indigo-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-pink-500/20 transition-colors">
        <ProductFilters />
        <ProductTable />
      </div>
    </div>
  );
}