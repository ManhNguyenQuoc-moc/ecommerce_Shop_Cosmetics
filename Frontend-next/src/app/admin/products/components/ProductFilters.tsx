"use client";

import { Filter, Plus, FileSpreadsheet } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { Tooltip, message } from "antd";
import { useState } from "react";
import AddProductModal from "./AddProductModal";
import { mutate } from "swr";
import { PRODUCT_API_ENDPOINT, createProduct } from "@/src/services/admin/product.service";

export default function ProductFilters() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
        <div className="flex-1 w-full max-w-xl">
          <SWTInputSearch 
            placeholder="Tìm kiếm tên sản phẩm, mã SKU..." 
            className="w-full !rounded-xl"
          />
        </div>

        {/* Sort + Action */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          
          {/* Sort */}
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 dark:border-slate-700 rounded-xl px-1">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 pl-3">
              Sắp xếp:
            </span>
            <SWTSelect 
              placeholder="Sắp xếp theo"
              className="min-w-[180px] !h-9 
              [&_.ant-select-selector]:!bg-transparent 
              [&_.ant-select-selector]:!border-none 
              [&_.ant-select-selector]:!shadow-none"
              defaultValue="newest"
              options={[
                { label: "Ngày tạo: Mới nhất", value: "newest" },
                { label: "Ngày tạo: Cũ nhất", value: "oldest" },
                { label: "Giá: Thấp đến Cao", value: "price_asc" },
                { label: "Giá: Cao đến Thấp", value: "price_desc" },
                { label: "Tồn kho: Nhiều nhất", value: "stock_desc" },
                { label: "Tồn kho: Ít nhất", value: "stock_asc" },
              ]}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Tooltip title="Nhập dữ liệu từ CSV/XLSX" placement="top" color="#10b981">
              <div className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
                <FileSpreadsheet size={18} className="group-hover:scale-110 transition-transform duration-300" />
              </div>
            </Tooltip>
            
            <Tooltip title="Thêm Sản Phẩm Mới" placement="top" color="#ec4899">
              <div 
                className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-brand-500/20 hover:bg-brand-50 dark:hover:bg-brand-500/30 text-brand-600 dark:text-brand-400 border border-slate-200 dark:border-brand-500 rounded-xl shadow-sm transition-all cursor-pointer group"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={20} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full p-4 
      bg-slate-50 dark:bg-slate-800/40 rounded-xl 
      border border-slate-100 dark:border-slate-700/60 shadow-inner">

        {/* LEFT: Title + Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1">

          {/* Title */}
          <div className="flex items-center gap-2 text-brand-600 dark:text-cyan-400 
          font-semibold pr-4 border-r border-slate-200 dark:border-slate-700">
            <Filter size={16} />
            <span className="text-xs uppercase tracking-wide">Bộ lọc</span>
          </div>

          {/* Category */}
          <SWTSelect
            placeholder="Danh mục"
            className="min-w-[150px] !h-10"
            options={[
              { label: "Tất cả danh mục", value: "all" },
              { label: "Chăm sóc da", value: "skincare" },
              { label: "Trang điểm", value: "makeup" },
              { label: "Nước hoa", value: "fragrance" }
            ]}
          />

          {/* Status */}
          <SWTSelect
            placeholder="Trạng thái"
            className="min-w-[150px] !h-10"
            options={[
              { label: "Tất cả trạng thái", value: "all" },
              { label: "Đang bán", value: "active" },
              { label: "Hết hàng", value: "out_of_stock" },
              { label: "Đã ẩn", value: "hidden" }
            ]}
          />
        </div>
        <div className="flex justify-end">
          <SWTButton
            type="text"
            className="!h-[35px] !px-3 !text-xs !rounded-md !w-auto whitespace-nowrap
            text-slate-400 hover:!text-red-500 hover:!bg-red-50 transition-colors"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
      <AddProductModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={async (data) => {
          try {
            await createProduct(data);
            message.success('Thêm sản phẩm thành công!');
            // Tell SWR to re-fetch any product queries
            mutate(
              (key: any) => typeof key === 'string' && key.startsWith(PRODUCT_API_ENDPOINT),
              undefined,
              { revalidate: true }
            );
            setIsAddModalOpen(false);
          } catch (err: any) {
            console.error("Create product error", err);
            message.error(err.message || 'Có lỗi xảy ra khi thêm sản phẩm');
          }
        }}
      />
    </>
  );
}