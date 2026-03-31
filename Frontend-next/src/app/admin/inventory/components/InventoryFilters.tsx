"use client";

import { Filter, FileSpreadsheet, Download } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";

export default function InventoryFilters() {
  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="flex-1 w-full max-w-xl">
            <SWTInputSearch 
              placeholder="Tìm kiếm mã lô, SKU sản phẩm..." 
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
                defaultValue="newest_batch"
                options={[
                  { label: "Ngày nhập kho: Gần nhất", value: "newest_batch" },
                  { label: "Ngày nhập kho: Cũ nhất", value: "oldest_batch" },
                  { label: "Hạn sử dụng: Gần nhất", value: "exp_asc" },
                  { label: "Số lượng: Nhiều nhất", value: "qty_desc" },
                ]}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <SWTTooltip title="Xuất báo cáo tồn kho" placement="top" color="#0ea5e9">
                <div className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-sky-50 dark:hover:bg-sky-500/20 text-sky-600 dark:text-sky-400 border border-slate-200 dark:border-sky-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
                  <Download size={18} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
              </SWTTooltip>
              
              <SWTTooltip title="Import Excel Nhập Tồn Kho Cũ" placement="top" color="#10b981">
                <div className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-emerald-500/20 hover:bg-emerald-50 dark:hover:bg-emerald-500/30 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500 rounded-xl shadow-sm transition-all cursor-pointer group">
                  <FileSpreadsheet size={18} className="group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </div>
              </SWTTooltip>
            </div>
          </div>
        </div>

        {/* FILTER BAR ROW 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full p-4 
        bg-slate-50 dark:bg-slate-800/40 rounded-xl 
        border border-slate-100 dark:border-slate-700/60 shadow-inner">

          <div className="flex flex-wrap items-center gap-3 flex-1">

            <div className="flex items-center gap-2 text-emerald-600 dark:text-teal-400 
            font-semibold pr-4 border-r border-slate-200 dark:border-slate-700">
              <Filter size={16} />
              <span className="text-xs uppercase tracking-wide">Bộ lọc</span>
            </div>

            <SWTSelect
              placeholder="Cảnh báo HSD"
              className="min-w-[150px] !h-10"
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Còn an toàn (>1 năm)", value: "safe" },
                { label: "Cận date (<6 tháng)", value: "warning" },
                { label: "Đã quá hạn", value: "expired" }
              ]}
            />

            <SWTSelect
              placeholder="Tình trạng Tồn"
              className="min-w-[150px] !h-10"
              options={[
                { label: "Tất cả lô", value: "all" },
                { label: "Còn hàng", value: "in_stock" },
                { label: "Sắp hết (<10)", value: "low_stock" },
                { label: "Đã hết hàng", value: "out_of_stock" }
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
    </>
  );
}
