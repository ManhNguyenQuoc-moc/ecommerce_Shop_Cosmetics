"use client";

import React from 'react';
import OrderFilters from "./components/OrderFilters";
import OrderTable from "./components/OrderTable";
import { Plus, ShoppingCart } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

export default function OrdersPage() {
  useSWTTitle("Quản Lý Đơn Hàng | Admin");
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Orders" }
          ]} />
          <div className="relative mt-2 overflow-hidden bg-gradient-to-r from-brand-500 to-rose-600 text-white px-5 py-2.5 rounded-tl-xl rounded-tr-3xl rounded-br-3xl rounded-bl-md shadow-lg shadow-brand-500/40 border border-white/20 flex items-center gap-3 w-fit group/title cursor-default mt-3 mb-2">
            <div className="absolute inset-0 bg-white/20 -skew-x-12 animate-sweep" />
            <ShoppingCart size={28} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] animate-pulse shrink-0" />
            <h2 className="!mb-0 text-2xl font-black tracking-tight drop-shadow-md whitespace-nowrap">
              Quản lý Đơn hàng
            </h2>
          </div>
          <p className="text-brand-500 dark:text-cyan-400 text-sm font-semibold uppercase tracking-widest drop-shadow-sm dark:drop-shadow-[0_0_5px_rgba(0,240,255,0.3)]">
            Theo dõi, xử lý và cập nhật trạng thái các đơn hàng của hệ thống.
          </p>
        </div>
        
        <SWTButton 
          type="primary" 
          className="!h-11 !w-11 !p-0 flex items-center justify-center !bg-brand-500 hover:!bg-brand-600 !text-brand-900 rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.4)] border-none"
        >
          <Plus size={20} className="stroke-[3]" />
        </SWTButton>
      </div>

      {/* Main Content */}
      <div className="p-6 bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl shadow-sm dark:shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-pink-500/20 transition-colors">
        <OrderFilters />
        <OrderTable />
      </div>
    </div>
  );
}
