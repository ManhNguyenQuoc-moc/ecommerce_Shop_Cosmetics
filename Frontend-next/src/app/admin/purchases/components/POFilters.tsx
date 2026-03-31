"use client";

import { Filter, Plus, FileSpreadsheet } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import { Tooltip, message } from "antd";
import { useState } from "react";
import CreatePOModal from "./CreatePOModal";

export default function POFilters() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="flex-1 w-full max-w-xl">
            <SWTInputSearch 
              placeholder="Tìm kiếm phiếu nhập, nhà cung cấp..." 
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
                  { label: "Tổng tiền: Thấp tới Cao", value: "total_asc" },
                  { label: "Tổng tiền: Cao xuống Thấp", value: "total_desc" },
                ]}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Tooltip title="Xuất dữ liệu Excel" placement="top" color="#10b981">
                <div className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
                  <FileSpreadsheet size={18} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
              </Tooltip>
              
              <Tooltip title="Tạo Phiếu Nhập Mới (PO)" placement="top" color="#f59e0b">
                <div 
                  className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-amber-500/20 hover:bg-amber-50 dark:hover:bg-amber-500/30 text-amber-600 dark:text-amber-400 border border-slate-200 dark:border-amber-500 rounded-xl shadow-sm transition-all cursor-pointer group"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={20} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </Tooltip>
            </div>
          </div>
        </div>

        {/* FILTER BAR ROW 2 */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full p-4 
        bg-slate-50 dark:bg-slate-800/40 rounded-xl 
        border border-slate-100 dark:border-slate-700/60 shadow-inner">

          <div className="flex flex-wrap items-center gap-3 flex-1">

            <div className="flex items-center gap-2 text-amber-600 dark:text-orange-400 
            font-semibold pr-4 border-r border-slate-200 dark:border-slate-700">
              <Filter size={16} />
              <span className="text-xs uppercase tracking-wide">Bộ lọc</span>
            </div>

            <SWTSelect
              placeholder="Trạng thái"
              className="min-w-[150px] !h-10"
              options={[
                { label: "Tất cả trạng thái", value: "all" },
                { label: "Chờ Duyệt (PENDING)", value: "PENDING" },
                { label: "Đã Nhận (RECEIVED)", value: "RECEIVED" },
                { label: "Đã Hủy (CANCELLED)", value: "CANCELLED" }
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

      <CreatePOModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
    </>
  );
}
