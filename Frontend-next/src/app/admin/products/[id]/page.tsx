"use client";

import React, { useState, use } from 'react';
import { Spin, Empty } from 'antd';
import { TrendingUp, Users, ArrowLeft, Star, Layers, Activity, PencilLine, MessageSquare } from "lucide-react";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import Link from 'next/link';
import { useProduct } from "@/src/services/admin/product.service";
import EditProductModal from "@/src/app/admin/products/components/EditProductModal";
import Image from "next/image";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  useSWTTitle("Chi Tiết Sản Phẩm | Admin");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { id } = use(params);
  const { product, isLoading, isError, mutate } = useProduct(id);


  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Empty description="Không tìm thấy sản phẩm hoặc có lỗi xảy ra" />
      </div>
    );
  }

  // Prisma schema: brand & category are objects, images come from productImages relation
  const brandName = typeof product.brand === 'object' ? product.brand?.name : product.brand;
  const categoryName = typeof product.category === 'object' ? product.category?.name : product.category;
  const mainImage = product.images?.[0] || product.productImages?.[0]?.image?.url || "/images/placeholder.png";

  const totalRevenue = product.variants?.reduce((sum: number, v: any) => {
    return sum + ((v.soldCount || 0) * (v.salePrice || v.price || 0));
  }, 0) || 0;

  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Products", href: "/admin/products" },
            { title: "Chi tiết" }
          ]} />
          
          <div className="flex items-center gap-4 mt-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-800 dark:text-white drop-shadow-md">
                Chi tiết Sản Phẩm
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                Mã SP: <span className="text-brand-600 font-bold">{product.id}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href="/admin/products">
            <button className="h-10 px-4 flex items-center gap-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium text-sm transition-colors">
              <ArrowLeft size={16} />
              Quay lại
            </button>
          </Link>
          <button
            onClick={() => setIsEditOpen(true)}
            className="h-10 px-4 flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors shadow-md shadow-brand-500/30"
          >
            <PencilLine size={16} />
            Sửa Sản Phẩm
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info Card */}
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 aspect-square rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200 relative group">
                <Image
                  src={mainImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  unoptimized={mainImage.startsWith('http')}
                />
                <div className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow-md ${
                  product.status === "Đang bán" ? "bg-emerald-500" : "bg-slate-500"
                }`}>
                  {product.status}
                </div>
              </div>
              <div className="w-full md:w-2/3 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 mb-2">
                  <span className="bg-brand-100 text-brand-700 text-xs font-bold px-2.5 py-1 rounded-md">{categoryName || 'Chưa phân loại'}</span>
                  <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">{brandName || 'N/A'}</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
                  {product.name}
                </h3>
                <div className="flex flex-wrap items-center gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-yellow-400">
                      <Star size={16} className="fill-current" />
                    </div>
                    <span className="text-slate-600 dark:text-slate-400 text-sm font-semibold">
                      {product.rating} ({product.reviewCount || 0} đánh giá)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 border-l border-slate-200 dark:border-slate-700 pl-4">
                    <MessageSquare size={16} />
                    <span className="text-sm font-semibold">{product.commentCount || 0} bình luận</span>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                  {product.shortdescription || product.description || 'Chưa có mô tả'}
                </p>
              </div>
            </div>
          </div>

          {/* Variants List */}
          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 rounded-xl bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-400">
                <Layers size={22} className="stroke-[2.5]" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 dark:text-white">Các Phiên Bản (Variants)</h4>
              <span className="ml-auto text-sm text-slate-400 font-medium">{product.variants?.length || 0} biến thể</span>
            </div>

            <div className="space-y-3">
              {product.variants?.length > 0 ? product.variants.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-fuchsia-300 dark:hover:border-fuchsia-500/40 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-slate-200">
                      {[v.size, v.color].filter(Boolean).join(" - ") || "Bản chuẩn"}
                    </h5>
                    <p className="text-sm font-semibold text-slate-500">Mã SKU: <span className="text-slate-700 dark:text-slate-400">{v.sku || 'N/A'}</span></p>
                  </div>
                  <div className="flex items-center gap-6 text-right">
                    <div className="min-w-[80px]">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Đã bán</p>
                      <p className="font-bold text-sky-600">{v.soldCount || 0}</p>
                    </div>
                    <div className="min-w-[100px]">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Giá bán</p>
                      <p className="font-bold text-brand-600 dark:text-brand-400">{formatCurrency(v.salePrice || v.price)}</p>
                    </div>
                    <div className="min-w-[80px]">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tồn kho</p>
                      <p className={`font-bold ${(v.stock || 0) > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{v.stock || 0}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <p className="text-slate-400 text-center py-6">Chưa có biến thể nào</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Analytics */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-500/30 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-center gap-3 mb-2">
              <Activity size={20} className="text-indigo-200" />
              <h4 className="font-bold text-indigo-100">Doanh thu ước tính</h4>
            </div>
            <div className="text-3xl font-black tracking-tight mb-1">{formatCurrency(totalRevenue)}</div>
            <div className="text-sm font-medium text-indigo-200 flex items-center gap-1">
              <TrendingUp size={16} className="text-emerald-300" />
              <span className="text-emerald-300">Dựa trên số lượng đã bán</span>
            </div>
          </div>

          <div className="bg-white/90 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200 dark:border-pink-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400">
                <Users size={22} className="stroke-[2.5]" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 dark:text-white">Hiệu suất bán hàng</h4>
            </div>
            
            <div className="space-y-6 mt-6">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Tổng sản phẩm đã bán</p>
                  <p className="text-3xl font-black text-slate-800 dark:text-white">{product.sold || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-500 text-xs font-bold uppercase mb-1">Tổng tồn kho</p>
                  <p className="text-2xl font-black text-emerald-600">{product.totalStock || 0}</p>
                </div>
              </div>
              
              {product.variants?.length > 0 && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-white mb-4 uppercase tracking-wider">Tỷ trọng doanh số theo Variant</h4>
                  <div className="space-y-4">
                    {product.variants.map((v: any, i: number) => {
                      const totalSold = product.sold || 1;
                      const pct = totalSold > 0 ? Math.round(((v.soldCount || 0) / totalSold) * 100) : 0;
                      return (
                        <div key={v.id}>
                          <div className="flex justify-between text-xs mb-1 font-bold">
                            <span className="text-slate-500 truncate mr-2">{v.size || v.color || "Tiêu chuẩn"}</span>
                            <span className="text-brand-600">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${['bg-brand-500', 'bg-purple-500', 'bg-blue-500', 'bg-amber-500'][i % 4]}`} 
                              style={{ width: `${pct}%` }} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        productId={id}
        onUpdated={() => mutate()}
      />
    </div>
  );
}
