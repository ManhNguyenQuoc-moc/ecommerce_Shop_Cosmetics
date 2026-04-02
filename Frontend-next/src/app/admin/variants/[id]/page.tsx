"use client";

import { use, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Empty } from "antd";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";
import {
  ArrowLeft,
  PencilLine,
  Database,
  Calendar,
  Package,
  TrendingUp,
  Tag,
  Hash
} from "lucide-react";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import Link from "next/link";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { useVariant } from "@/src/services/admin/product.service";
import Image from "next/image";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import moment from "moment";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

const CARD_BASE =
  "!bg-white/90 dark:!bg-slate-900/80 !backdrop-blur-md !rounded-3xl !shadow-sm !border !border-slate-200 dark:!border-brand-500/20";

export default function VariantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  useSWTTitle("Chi Tiết Biến Thể | Admin");

  const searchParams = useSearchParams();
  const fromProduct = searchParams.get("from") === "product";
  const productId = searchParams.get("productId");

  const { id } = use(params);
  const { variant, isLoading, isError, mutate } = useVariant(id);

  if (isLoading) {
    return <SWTLoading tip="Đang tải thông tin biến thể..." />;
  }

  if (isError || !variant) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Empty description="Không tìm thấy biến thể hoặc có lỗi xảy ra" />
      </div>
    );
  }

  const variantName = [variant.product.name, variant.color, variant.size]
    .filter(Boolean)
    .join(" - ");

  const mainImage = variant.image || "/images/placeholder.png";

  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb
            items={[
              { title: "Trang chủ", href: "/admin" },
              fromProduct && productId
                ? { title: "Sản phẩm", href: `/admin/products/${productId}` }
                : { title: "Biến thể", href: "/admin/variants" },
              { title: "Chi tiết" },
            ]}
          />

          <div className="mt-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              Chi tiết Biến thể
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs">
              <p>Mã BT: <span className="text-brand-600 font-bold">{variant.id}</span></p>
              <span>•</span>
              <p>Mã SP: <Link href={`/admin/products/${variant.productId}`} className="text-blue-500 hover:underline">{variant.productId}</Link></p>
              <span>•</span>
              <p>Ngày tạo: <span className="text-slate-700 font-medium dark:text-slate-300">{moment(variant.createdAt).format("DD/MM/YYYY HH:mm")}</span></p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Link href={fromProduct && productId ? `/admin/products/${productId}` : "/admin/variants"}>
            <SWTButton
              className="!w-auto !h-10 !px-4 !rounded-xl !bg-white dark:!bg-slate-800 hover:!bg-slate-100 dark:hover:!bg-slate-700 !text-slate-700 dark:!text-slate-200 !border !border-slate-200 dark:!border-slate-700 !shadow-sm !font-bold !text-sm inline-flex items-center gap-2"
              startIcon={<ArrowLeft size={16} />}
            >
              Quay lại
            </SWTButton>
          </Link>
          <SWTButton
            className="!w-auto !h-10 !px-4 !rounded-xl !bg-brand-600 !text-white hover:!bg-brand-700 !shadow-md !shadow-brand-500/20 inline-flex items-center gap-2"
            startIcon={<PencilLine size={16} />}
          >
            Sửa biến thể
          </SWTButton>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* MAIN INFO CARD */}
          <SWTCard className={CARD_BASE} bodyClassName="!p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 aspect-square rounded-3xl bg-slate-100 dark:bg-slate-800 overflow-hidden relative border border-slate-100 dark:border-slate-700 shadow-inner">
                <Image
                  src={mainImage}
                  alt={variantName}
                  fill
                  className="object-cover transition-transform hover:scale-105 duration-500"
                  unoptimized={mainImage.startsWith("http")}
                />
                <div className="absolute top-4 left-4 text-white text-[10px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/10">
                  {variant.status}
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border border-brand-100 dark:border-brand-500/20">
                    {variant.statusName || "NEW"}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] uppercase font-black px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700">
                    VARIANT
                  </span>
                </div>

                <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2 leading-tight">
                  {variantName}
                </h3>
                
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-6">
                  <Hash size={14} />
                  <span className="font-mono tracking-tighter uppercase font-medium">SKU: {variant.sku || "N/A"}</span>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Tag size={10} /> Giá bán hiện tại
                    </p>
                    <div className="flex flex-col">
                      <span className="text-2xl font-black text-brand-600">
                        {formatCurrency(variant.salePrice || variant.price)}
                      </span>
                      {variant.salePrice && (
                        <span className="text-xs text-slate-400 line-through font-medium">
                          {formatCurrency(variant.price)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                      <Package size={10} /> Tổng tồn kho
                    </p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-slate-800 dark:text-white">
                        {variant.stock}
                      </span>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Sản phẩm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SWTCard>

          {/* BATCHES TABLE CARD */}
          <SWTCard className={CARD_BASE} bodyClassName="!p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-500">
                  <Database size={20} />
                </div>
                <div>
                  <h4 className="!m-0 font-black text-lg text-slate-800 dark:text-white uppercase tracking-tight">Danh sách Lô hàng</h4>
                  <p className="text-xs text-slate-400 font-medium">Chi tiết các lô hàng đang lưu kho cho biến thể này</p>
                </div>
              </div>
              <span className="bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 dark:border-orange-500/20">
                {variant.batches?.length || 0} Lô hàng
              </span>
            </div>

            <SWTTable
              dataSource={variant.batches || []}
              rowKey="id"
              pagination={false}
              className="mt-2"
              columns={[
                {
                  title: "SỐ LÔ (BATCH NO.)",
                  dataIndex: "batchNumber",
                  key: "batchNumber",
                  render: (val: string) => (
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.5)]" />
                       <span className="font-bold text-slate-700 dark:text-slate-200">{val}</span>
                    </div>
                  )
                },
                {
                  title: "HẠN SỬ DỤNG",
                  dataIndex: "expiryDate",
                  key: "expiryDate",
                  align: "center",
                  render: (date: string) => {
                    const isExpiringSoon = moment(date).diff(moment(), 'months') < 6;
                    return (
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border font-bold text-xs ${
                        isExpiringSoon 
                        ? "bg-red-50 text-red-600 border-red-100 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20" 
                        : "bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700"
                      }`}>
                        <Calendar size={12} />
                        {moment(date).format("DD/MM/YYYY")}
                      </div>
                    );
                  }
                },
                {
                  title: "NGÀY SẢN XUẤT",
                  dataIndex: "manufacturingDate",
                  key: "manufacturingDate",
                  align: "center",
                  render: (date: string) => date ? moment(date).format("DD/MM/YYYY") : "N/A"
                },
                {
                  title: "SỐ LƯỢNG",
                  dataIndex: "quantity",
                  key: "quantity",
                  align: "right",
                  render: (qty: number) => (
                    <span className={`font-black text-lg ${qty > 0 ? "text-emerald-600" : "text-slate-400"}`}>
                      {qty}
                    </span>
                  )
                },
                {
                  title: "GIÁ NHẬP",
                  dataIndex: "costPrice",
                  key: "costPrice",
                  align: "right",
                  render: (val: number) => (
                    <span className="font-bold text-slate-500 dark:text-slate-400">
                      {formatCurrency(val)}
                    </span>
                  )
                }
              ]}
            />
          </SWTCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
           {/* QUICK STATS */}
           <SWTCard
            className="!bg-gradient-to-br !from-orange-500 !to-orange-600 !rounded-3xl !text-white !border-none shadow-xl shadow-orange-500/20"
            bodyClassName="!p-6"
          >
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <TrendingUp size={18} />
              <span className="text-xs uppercase font-black tracking-widest">Giá trị tồn kho lô</span>
            </div>
            <div className="text-3xl font-black text-center mb-1 drop-shadow-md">
              {formatCurrency(variant.batches?.reduce((sum: number, b: any) => sum + (b.quantity * b.costPrice), 0) || 0)}
            </div>
            <p className="text-center text-[10px] font-bold opacity-60 uppercase tracking-tighter">
              Tính trên giá nhập thực tế của các lô
            </p>
          </SWTCard>

          {/* INFO DETAILS -> RECHART */}
          <SWTCard className={CARD_BASE} bodyClassName="!p-6">
             <div className="space-y-6">
                <div>
                   <h5 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-2">
                     <TrendingUp size={12} />
                     Thống kê nhập/xuất theo lô
                   </h5>
                   
                   <div className="w-full h-[300px] mt-4">
                     <ResponsiveContainer width="100%" height="100%">
                       <BarChart
                         data={variant.batches?.map(b => ({
                           name: b.batchNumber,
                           "Nhập": b.totalIn,
                           "Bán": b.totalOut,
                         })) || []}
                         margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
                       >
                         <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                         <XAxis 
                           dataKey="name" 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                         />
                         <YAxis 
                           axisLine={false} 
                           tickLine={false} 
                           tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }}
                         />
                         <ReTooltip 
                           cursor={{ fill: '#f8fafc' }}
                           contentStyle={{ 
                             borderRadius: '16px', 
                             border: 'none', 
                             boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                             fontSize: '12px',
                             fontWeight: 700
                           }}
                         />
                         <Legend 
                           verticalAlign="top" 
                           align="right" 
                           iconType="circle"
                           wrapperStyle={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '20px' }}
                         />
                         <Bar dataKey="Nhập" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={16} />
                         <Bar dataKey="Bán" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={16} />
                       </BarChart>
                     </ResponsiveContainer>
                   </div>
                </div>

                <div className="bg-brand-50/50 dark:bg-brand-500/5 p-4 rounded-2xl border border-brand-100/50 dark:border-brand-500/10">
                   <p className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-tighter mb-2">Lời nhắc kho</p>
                   <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      Biến thể này hiện có <strong>{variant.batches?.length || 0}</strong> lô hàng trong kho. 
                      Dựa trên biểu đồ, hãy ưu tiên xuất các lô có tỷ lệ <strong>"Nhập"</strong> cao nhưng <strong>"Bán"</strong> còn thấp.
                   </p>
                </div>
             </div>
          </SWTCard>
        </div>
      </div>
    </div>
  );
}
