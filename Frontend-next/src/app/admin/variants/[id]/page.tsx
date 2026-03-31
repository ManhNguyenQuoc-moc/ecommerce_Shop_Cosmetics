"use client";

import React from 'react';
import { PackageSearch, TrendingDown, ArrowLeft, Edit, Target, ShoppingCart, BarChart3 } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import InventoryTable from "../../inventory/components/InventoryTable";
import Link from 'next/link';

export default function VariantDetailPage({ params }: { params: { id: string } }) {
  useSWTTitle("Chi Tiết Variant | Admin");
  
  // Mock Data
  const variant = {
    id: params.id,
    sku: "VAR-001",
    productName: "Tinh chất phục hồi Estee Lauder",
    name: "Dung tích 20ml",
    priceDiff: "+0đ",
    stock: 45,
    status: "Đang bán",
    barcode: "880943242341",
    weight: "50g",
    dimensions: "5x5x12 cm"
  };

  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Variants", href: "/admin/variants" },
            { title: "Chi tiết" }
          ]} />
          
          <div className="flex items-center gap-4 mt-4">
            <Link href="/admin/variants">
              <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 transition-colors shadow-sm">
                <ArrowLeft size={20} />
              </button>
            </Link>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white drop-shadow-md">
                Phiên Bản Chi Tiết
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Sản phẩm: <span className="text-brand-600 font-bold">{variant.productName}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <SWTButton variant="primary" icon={<Edit size={16}/>} className="!bg-brand-600 hover:!bg-brand-700 !shadow-lg shadow-brand-500/30 !h-10">
            Chỉnh sửa
          </SWTButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Variant Status & Inventory Tab */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-pink-500/20">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Mã SKU</p>
                <p className="text-lg font-black text-slate-800 dark:text-white">{variant.sku}</p>
             </div>
             <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-pink-500/20">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Thuộc tính</p>
                <p className="text-lg font-black text-brand-600">{variant.name}</p>
             </div>
             <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-pink-500/20">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Giá chênh lệch</p>
                <p className="text-lg font-black text-slate-800 dark:text-white">{variant.priceDiff}</p>
             </div>
             <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-emerald-500/30 ring-1 ring-emerald-500/20">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Tồn kho</p>
                <p className="text-xl font-black text-emerald-600 drop-shadow-sm">{variant.stock}</p>
             </div>
          </div>

          {/* Details Card */}
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20">
             <h4 className="text-lg font-bold text-slate-800 dark:text-white mb-4 border-b border-slate-100 pb-3">Thông số kỹ thuật</h4>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                   <span className="text-slate-500 font-semibold">Trọng lượng (Weight)</span>
                   <span className="font-bold text-slate-800 dark:text-slate-200">{variant.weight}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                   <span className="text-slate-500 font-semibold">Kích thước (WxDxH)</span>
                   <span className="font-bold text-slate-800 dark:text-slate-200">{variant.dimensions}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                   <span className="text-slate-500 font-semibold">Mã vạch (Barcode)</span>
                   <span className="font-bold text-slate-800 dark:text-slate-200">{variant.barcode}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 dark:border-slate-800 pb-2">
                   <span className="text-slate-500 font-semibold">Trạng thái</span>
                   <span className="font-bold text-emerald-600">{variant.status}</span>
                </div>
             </div>
          </div>

          {/* Inventory Tab (Batches specifically for this variant) */}
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
                  <PackageSearch size={22} className="stroke-[2.5]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-slate-800 dark:text-white">Kiểm tra Tồn kho Lô (Batch)</h4>
                  <p className="text-xs font-semibold text-slate-500 mt-0.5">Danh sách các lô hàng đang lưu trữ của biến thể này</p>
                </div>
              </div>
              <SWTButton className="!bg-emerald-50 !text-emerald-700 !border-emerald-200 hover:!bg-emerald-100 text-sm font-bold shadow-sm">
                + Nhập lô mới (PO)
              </SWTButton>
            </div>

            <div className="-mx-6 border-t border-slate-100 dark:border-slate-800 relative z-10 bg-white/50 dark:bg-slate-900/50">
               <div className="p-4 px-6 scale-[0.98] origin-top">
                 {/* Reusing InventoryTable here acts as the 'Tab' content without being a literal tab */}
                 <InventoryTable />
               </div>
            </div>
          </div>

        </div>

        {/* Right Column: Analytics & KPI Charts */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-lg shadow-pink-500/30 relative overflow-hidden">
             <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
             <div className="flex items-center gap-3 mb-2">
               <ShoppingCart size={20} className="text-pink-200" />
               <h4 className="font-bold text-pink-100">Đã bán trong tháng</h4>
             </div>
             <div className="text-4xl font-black tracking-tight mb-1">340</div>
             <div className="text-sm font-medium text-pink-200 flex items-center gap-1">
               <TrendingDown size={16} className="text-white" />
               <span className="text-white">-2%</span> so với tháng trước
             </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400">
                <BarChart3 size={22} className="stroke-[2.5]" />
              </div>
              <h4 className="text-md font-bold text-slate-800 dark:text-white">Tốc độ xuất kho (Burn Rate)</h4>
            </div>

            <div className="space-y-5">
               <div>
                  <div className="flex justify-between text-xs mb-1 font-bold text-slate-500">
                    <span>Trung bình ngày</span>
                    <span className="text-slate-800 dark:text-slate-200">11.3 SP / ngày</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-blue-500 rounded-full w-[45%]" />
                  </div>
               </div>
               <div>
                  <div className="flex justify-between text-xs mb-1 font-bold text-slate-500">
                    <span>Dự kiến hết hàng (Out of stock)</span>
                    <span className="text-orange-500">Trong 4 ngày tới</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-orange-400 rounded-full w-[85%]" />
                  </div>
               </div>
               <div className="mt-4 p-3 rounded-xl bg-orange-50 border border-orange-100 dark:bg-orange-900/20 dark:border-orange-500/30">
                 <div className="flex items-start gap-2 text-orange-700 dark:text-orange-400">
                   <Target size={18} className="shrink-0 mt-0.5" />
                   <p className="text-xs font-semibold leading-relaxed">
                     Hàng sắp hết! Bạn nên theo dõi để lên <span className="font-bold underline cursor-pointer">Purchase Order</span> kịp thời nhập Lô mới trước cuối tuần.
                   </p>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
