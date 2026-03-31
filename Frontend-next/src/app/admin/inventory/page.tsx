"use client";

import React, { useState } from 'react';
import { PackageSearch, Info, Download, Upload } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import InventoryTable from "./components/InventoryTable";
import InventoryFilters from "./components/InventoryFilters";

export default function InventoryPage() {
  useSWTTitle("Quản Lý Tồn Kho | Admin");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Inventory" }
          ]} />
          <div className="relative mt-2 overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-5 py-2.5 rounded-tl-xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-lg shadow-emerald-500/40 border border-white/20 flex items-center gap-3 w-fit group/title cursor-default mt-3 mb-2">
            <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-sweep" />
            <PackageSearch size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />
            <h2 className="!mb-0 text-2xl font-black tracking-tight drop-shadow-md whitespace-nowrap">
              Quản lý Tồn kho & Lô (Batch)
            </h2>
          </div>
          <p className="text-emerald-500 dark:text-cyan-400 text-sm font-semibold uppercase tracking-widest drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">
            Theo dõi lô hàng, nhận hàng kho từ PO, và lịch sử giao dịch tồn kho.
          </p>
        </div>
        <SWTTooltip
          title={<span className="text-sm">Theo dõi số lượng tồn kho công thức FEFO và hạn sử dụng.</span>}
          placement="left"
          color="cyan"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-emerald-50 hover:bg-emerald-500/10 dark:bg-slate-800 dark:hover:bg-slate-700 text-emerald-600 dark:text-cyan-400 rounded-xl cursor-help transition-all shadow-sm border border-emerald-200 dark:border-slate-700 group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-emerald-500/20 transition-colors">
        <InventoryFilters />
        <InventoryTable />
      </div>
    </div>
  );
}
