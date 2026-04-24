"use client"

import { useState, useEffect, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { Empty } from "antd";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import {
  TrendingUp,
  Users,
  ArrowLeft,
  Star,
  Layers,
  Activity,
  PencilLine,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import Link from "next/link";
import { useProduct, useVariants } from "@/src/services/admin/product/product.hook";
import EditProductModal from "@/src/app/admin/products/components/EditProductModal";
import Image from "next/image";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTTable from "@/src/@core/component/AntD/SWTTable";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import AdminReviewManagement from "./components/AdminReviewManagement";
import AdminQuestionManagement from "./components/AdminQuestionManagement";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

const CARD_BASE =
  "!bg-white/90 dark:!bg-slate-900/80 !backdrop-blur-md !rounded-3xl !shadow-sm !border !border-slate-200 dark:!border-pink-500/20";

const statusMap: Record<string, string> = {
  ACTIVE: "Đang bán",
  HIDDEN: "Ẩn",
  STOPPED: "Ngừng bán",
};

export default function ProductDetailClient({ id }: { id: string }) {
  useSWTTitle("Chi Tiết Sản Phẩm | Admin");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [openPreview, setOpenPreview] = useState(false);

  const { product, isLoading: isProductLoading, isError: isProductError, mutate: mutateProduct } = useProduct(id);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const {
    variants: paginatedVariants,
    total: variantsTotal,
    isLoading: isVariantsLoading
  } = useVariants(currentPage, pageSize, { productId: id });

  const isLoading = isProductLoading || isVariantsLoading;
  const isError = isProductError;
  
  const mutate = useCallback(() => {
    mutateProduct();
  }, [mutateProduct]);

  const galleryImages = Array.from(new Set([
    ...(product?.images || []),
    ...(product?.productImages?.map((pi: any) => pi.image?.url).filter(Boolean) || [])
  ]));

  useEffect(() => {
    if (galleryImages.length > 0 && !activeImage) {
      setActiveImage(galleryImages[0]);
    }
  }, [galleryImages, activeImage]);

  if (isLoading) {
    return <SWTLoading tip="Đang tải thông tin sản phẩm..." />;
  }

  if (isError || !product) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <Empty description="Không tìm thấy sản phẩm hoặc có lỗi xảy ra" />
      </div>
    );
  }
  
  const categoryName = product.category?.name;
  const brandName = product.brand?.name;
  const displayImage = activeImage || galleryImages[0] || "/images/placeholder.png";

  const totalRevenue =
    product.variants?.reduce((sum: number, v: any) => {
      return sum + (v.sold || 0) * (v.salePrice || v.price || 0);
    }, 0) || 0;
  const totalSold =
    product.variants?.reduce((sum: number, v: any) => {
      return sum + (v.sold || 0);
    }, 0) || 0;
  const totalCost =
    product.variants?.reduce((sum: number, v: any) => {
      return sum + (v.sold || 0) * (v.costPrice || 0);
    }, 0) || 0;
  const totalProfit = totalRevenue - totalCost;

  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb
            items={[
              { title: "Trang chủ", href: "/admin" },
              { title: "Sản phẩm", href: "/admin/products" },
              { title: "Chi tiết" },
            ]}
          />

          <div className="mt-4">
            <h2 className="text-2xl font-black text-slate-800 dark:text-white">
              Chi tiết Sản Phẩm
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-500 text-xs text-[10px] font-bold uppercase tracking-wider">
              <p>Mã SP: <span className="text-brand-600 font-black">{product.id}</span></p>
              <span className="opacity-30">•</span>
              <p>Ngày tạo: <span className="text-slate-700 dark:text-slate-300 font-bold">{new Date(product.createdAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span></p>
              <span className="opacity-30">•</span>
              <p>Cập nhật: <span className="text-slate-700 dark:text-slate-300 font-bold">{new Date(product.updatedAt).toLocaleDateString("vi-VN", { hour: '2-digit', minute: '2-digit' })}</span></p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/admin/products">
            <button className="h-10 px-5 flex items-center gap-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all shadow-sm font-bold text-sm">
              <ArrowLeft size={16} />
              Danh sách
            </button>
          </Link>
          <button
            onClick={() => setIsEditOpen(true)}
            className="h-10 px-6 flex items-center gap-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700 transition-all shadow-md shadow-brand-500/20 font-bold text-sm"
          >
            <PencilLine size={16} />
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          <SWTCard className={CARD_BASE} bodyClassName="!p-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-2/5 flex flex-col gap-3">
                <div
                  className="aspect-square rounded-2xl bg-slate-100 overflow-hidden relative border border-slate-200 cursor-zoom-in hover:shadow-xl transition-all duration-500 group"
                  onClick={() => setOpenPreview(true)}
                >
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={displayImage.startsWith("http")}
                  />
                  <div className="absolute top-3 left-3 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded bg-slate-900/60 backdrop-blur-md border border-white/10 shadow-lg">
                    {statusMap[product.statusRaw]}
                  </div>
                </div>

                {galleryImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    {galleryImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setActiveImage(img)}
                        className={`relative w-16 h-16 flex-shrink-0 cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden shadow-sm ${activeImage === img ? "border-brand-500 scale-95 shadow-brand-500/20" : "border-slate-100 hover:border-slate-300"
                          }`}
                      >
                        <Image
                          src={img}
                          alt={`thumbnail-${idx}`}
                          fill
                          className="object-cover"
                          unoptimized={img.startsWith("http")}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex-1 flex flex-col py-2">
                <div className="flex gap-2 mb-4">
                  <span className="bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border border-brand-100 dark:border-brand-500/20">
                    {categoryName || "Chưa phân loại"}
                  </span>
                  <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] uppercase font-black px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
                    {brandName || "N/A"}
                  </span>
                </div>

                <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-4 leading-tight tracking-tight">
                  {product.name}
                </h3>

                <div className="flex items-center gap-6 mb-8">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <Star size={20} fill="currentColor" />
                    <span className="font-black text-xl">{Number(product.rating || 0).toFixed(1)}</span>
                    <span className="text-slate-400 text-sm font-medium">({product.reviewCount || 0} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-blue-500 border-l border-slate-100 dark:border-slate-800 pl-6">
                    <MessageSquare size={20} />
                    <span className="font-black text-xl">{product.commentCount || 0}</span>
                    <span className="text-slate-400 text-sm font-medium">bình luận</span>
                  </div>
                </div>

                <div className="bg-slate-50/50 dark:bg-slate-800/30 p-5 rounded-3xl border border-slate-100 dark:border-slate-800/50 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-slate-200 dark:bg-slate-700 group-hover:bg-brand-500 transition-colors" />
                  <span className="font-black block mb-2 text-[10px] uppercase text-slate-400 tracking-widest">Ghi chú nhanh</span>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium italic">
                    {product.short_description || "Sản phẩm chính hãng chất lượng cao."}
                  </p>
                </div>
              </div>
            </div>
          </SWTCard>

          <SWTCard className={CARD_BASE} bodyClassName="!p-6">
            <SWTTabs
              defaultActiveKey="description"
              className="dark:[&_.ant-tabs-nav]:!border-slate-800 dark:[&_.ant-tabs-tab]:!text-slate-400 [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-brand-500"
              items={[
                {
                  key: "description",
                  label: "Mô tả",
                  children: (
                    <div className="space-y-6 pt-2">
                      {product.short_description && (
                        <div className="bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-3 flex items-center gap-2">
                            <Activity size={14} className="text-brand-500" /> Mô tả ngắn
                          </h5>
                          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{product.short_description}</p>
                        </div>
                      )}
                      <div className="p-4">
                        <h5 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-4 flex items-center gap-2">
                          <Layers size={14} className="text-brand-500" /> Chi tiết sản phẩm
                        </h5>
                        <div className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap space-y-4">
                          {product.long_description || "Chưa có mô tả chi tiết cho sản phẩm này."}
                        </div>
                      </div>
                    </div>
                  )
                },
                {
                  key: "specs",
                  label: "Thông số",
                  prefix: { value: product.specifications?.length || 0, color: "info" },
                  children: (
                    <div className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                        {product.specifications?.map((spec: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800/60 last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors px-3 rounded-xl">
                            <span className="text-slate-500 dark:text-slate-400 text-xs font-medium uppercase tracking-tight">{spec.label}</span>
                            <span className="text-slate-800 dark:text-slate-200 text-sm font-bold">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                      {(!product.specifications || product.specifications.length === 0) && (
                        <div className="text-center py-10 text-slate-400 italic text-sm">Chưa có thông số kỹ thuật</div>
                      )}
                    </div>
                  )
                },
                {
                  key: "reviews",
                  label: "Đánh giá",
                  forceRender: true,
                  prefix: { value: product.reviewCount || 0, color: "warning" },
                  children: (
                    <div className="pt-4">
                      <AdminReviewManagement productId={id} />
                    </div>
                  )
                },
                {
                  key: "qa",
                  label: "Hỏi đáp",
                  forceRender: true,
                  prefix: { value: product.commentCount || 0, color: "primary" },
                  children: (
                    <div className="pt-4">
                      <AdminQuestionManagement productId={id} />
                    </div>
                  )
                }
              ]}
            />
          </SWTCard>

          <SWTCard className={CARD_BASE} bodyClassName="!p-6">
            <div className="flex items-center mb-6">
              <Layers size={20} className="text-brand-600" />
              <h4 className="ml-2 !mb-0 font-bold text-lg">Biến thể sản phẩm</h4>
              <span className="ml-auto bg-brand-50 text-brand-600 px-3 py-1 rounded-full text-xs font-bold">
                {product.variants?.length || 0} Phân loại
              </span>
            </div>

            <SWTTable
              dataSource={paginatedVariants}
              rowKey="id"
              pagination={{
                totalCount: variantsTotal,
                page: currentPage,
                fetch: pageSize,
                onChange: (p) => setCurrentPage(p)
              }}
              columns={[
                {
                  title: "Hình ảnh",
                  dataIndex: "image",
                  key: "image",
                  width: 80,
                  render: (img: string) => (
                    <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200">
                      <Image
                        src={img || "/images/placeholder.png"}
                        alt="variant"
                        fill
                        className="object-cover"
                        unoptimized={img?.startsWith("http")}
                      />
                    </div>
                  ),
                },
                {
                  title: "Phân loại",
                  key: "variant_name",
                  render: (_: any, record: any) => (
                    <Link
                      href={`/admin/variants/${record.id}?from=product&productId=${id}`}
                      className="flex flex-col group transition-all"
                    >
                      <span className="font-bold text-slate-700 group-hover:text-brand-600 transition-colors">
                        {[record.size, record.color].filter(Boolean).join(" - ") || "Tiêu chuẩn"}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">SKU: {record.sku}</span>
                    </Link>
                  ),
                },
                {
                  title: "Giá bán",
                  dataIndex: "price",
                  key: "price",
                  align: "right",
                  render: (_: number, record: any) => (
                    <div className="flex flex-col items-end">
                      <span className="font-bold text-brand-600">
                        {formatCurrency(record.salePrice || record.price)}
                      </span>
                      {record.salePrice && (
                        <span className="text-[10px] text-slate-400 line-through">
                          {formatCurrency(record.price)}
                        </span>
                      )}
                    </div>
                  ),
                },
                {
                  title: "Tồn kho",
                  dataIndex: "stock",
                  key: "stock",
                  align: "center",
                  render: (stock: number) => (
                    <span >
                      {stock}
                    </span>
                  ),
                },
                {
                  title: "Đã bán",
                  dataIndex: "sold",
                  key: "sold",
                  align: "center",
                  render: (sold: number) => (
                    <span className="font-bold text-slate-600">{sold || 0}</span>
                  ),
                },
              ]}
            />
          </SWTCard>
        </div>

        <div className="flex flex-col gap-6">
          <SWTCard
            className="!bg-brand-500/10 !backdrop-blur-md !rounded-3xl !text-brand-600 dark:!text-brand-400 !border !border-brand-500/20 shadow-lg shadow-brand-500/5"
            bodyClassName="!p-6"
          >
            <div className="flex items-center gap-2 mb-2 opacity-80 font-bold">
              <Activity size={18} />
              <span className="text-sm uppercase tracking-widest">Doanh thu</span>
            </div>
            <div className="text-4xl font-black text-center break-all">
              {formatCurrency(totalRevenue)}
            </div>
            <div className="text-xs text-brand-600/70 dark:text-brand-400/70 flex items-center justify-center gap-1 mt-3 font-bold uppercase tracking-tighter">
              <TrendingUp size={12} />
              Dựa trên tổng số lượng bán
            </div>
          </SWTCard>

          <SWTCard
            className="!bg-emerald-500/10 !backdrop-blur-md !rounded-3xl !text-emerald-600 dark:!text-emerald-400 !border !border-emerald-500/20 shadow-lg shadow-emerald-500/5"
            bodyClassName="!p-6"
          >
            <div className="flex items-center gap-2 mb-2 opacity-80 font-bold">
              <DollarSign size={18} />
              <span className="text-sm uppercase tracking-widest">Lợi nhuận</span>
            </div>
            <div className="text-4xl font-black text-center break-all">
              {formatCurrency(totalProfit)}
            </div>
            <div className="text-xs text-emerald-600/70 dark:text-emerald-400/70 flex items-center justify-center gap-1 mt-3 font-bold uppercase tracking-tighter">
              <TrendingUp size={12} />
              {totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}% tỷ suất lợi nhuận` : "Chưa có dữ liệu"}
            </div>
          </SWTCard>

          <SWTCard className={CARD_BASE} bodyClassName="!p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users size={20} />
              <h4 className="!m-0 font-bold">Hiệu suất bán hàng</h4>
            </div>

            <div className="flex justify-between mb-6">
              <div>
                <p className="text-xs">Đã bán</p>
                <p className="text-2xl font-bold">{totalSold}</p>
              </div>
            </div>

            {product.variants?.length > 0 && totalSold > 0 && (
              <div className="w-full h-[240px]">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={product.variants.map((v: any) => ({
                        name: [v.size, v.color].filter(Boolean).join(" - ") || "Tiêu chuẩn",
                        value: v.sold,
                      }))}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                      label={({ percent }) => `${(Number(percent) * 100).toFixed(0)}%`}
                    >
                      {product.variants.map((_: any, index: number) => (
                        <Cell key={index} fill={["#6366f1", "#a855f7", "#3b82f6", "#f59e0b"][index % 4]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => `${value} sản phẩm`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {totalSold === 0 && (
              <p className="text-center text-slate-400 text-sm">
                Chưa có dữ liệu bán hàng
              </p>
            )}
          </SWTCard>

          <SWTCard className={CARD_BASE} bodyClassName="!p-6">
            <div className="flex items-center gap-2 mb-4">
              <Layers size={20} className="text-slate-700 dark:text-slate-300" />
              <h4 className="!m-0 font-bold">Tồn kho biến thể</h4>
            </div>

            <div className="flex justify-between mb-6">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Tổng tồn kho</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">
                  {product.variants?.reduce((sum: number, v: any) => sum + (v.stock || 0), 0) || 0}
                </p>
              </div>
            </div>

            {product.variants && product.variants.length > 0 ? (
              <div className="w-full h-[240px]">
                <ResponsiveContainer>
                  <BarChart data={product.variants.map((v: any) => ({
                    name: v.sku,
                    stock: v.stock || 0,
                    sold: v.sold || 0,
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis 
                      dataKey="name" 
                      height={60}
                      tick={{ fontSize: 12, fill: '#64748b' }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => `${value} sản phẩm`}
                    />
                    <Legend />
                    <Bar dataKey="stock" fill="#10b981" name="Tồn kho" radius={[8, 8, 0, 0]} />
                    <Bar dataKey="sold" fill="#f59e0b" name="Đã bán" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-center text-slate-400 text-sm">
                Chưa có biến thể nào
              </p>
            )}
          </SWTCard>
        </div>
      </div>

      <EditProductModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        productId={id}
        onUpdated={() => mutate()}
      />

      <Lightbox
        open={openPreview}
        close={() => setOpenPreview(false)}
        slides={galleryImages.map((img) => ({ src: img }))}
      />
    </div>
  );
}
