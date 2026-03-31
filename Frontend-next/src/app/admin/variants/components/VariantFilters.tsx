import { FileSpreadsheet, Filter, Plus } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { useState } from "react";
import AddVariantModal from "./AddVariantModal";

export default function VariantFilters({ onUpdate }: { onUpdate: () => void }) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="flex-1 w-full max-w-xl">
            <SWTInputSearch 
              placeholder="Tìm kiếm tên biến thể, mã SKU..." 
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
                  { label: "Giá bán: Thấp đến Cao", value: "price_asc" },
                  { label: "Giá bán: Cao đến Thấp", value: "price_desc" },
                ]}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <SWTTooltip title="Nhập dữ liệu quy đổi từ Excel" placement="top" color="#10b981">
                <div className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
                  <FileSpreadsheet size={18} className="group-hover:scale-110 transition-transform duration-300" />
                </div>
              </SWTTooltip>
              
              <SWTTooltip title="Thêm Biến Thể Mới" placement="top" color="#d946ef">
                <div 
                  className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-fuchsia-500/20 hover:bg-fuchsia-50 dark:hover:bg-fuchsia-500/30 text-fuchsia-600 dark:text-fuchsia-400 border border-slate-200 dark:border-fuchsia-500 rounded-xl shadow-sm transition-all cursor-pointer group"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Plus size={20} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
                </div>
              </SWTTooltip>
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
            <div className="flex items-center gap-2 text-fuchsia-600 dark:text-purple-400 
            font-semibold pr-4 border-r border-slate-200 dark:border-slate-700">
              <Filter size={16} />
              <span className="text-xs uppercase tracking-wide">Bộ lọc</span>
            </div>

            {/* Classification */}
            <SWTSelect
              placeholder="Phân loại"
              className="min-w-[150px] !h-10"
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Màu sắc", value: "color" },
                { label: "Dung tích", value: "volume" },
                { label: "Kích thước", value: "size" }
              ]}
            />

            {/* Status */}
            <SWTSelect
              placeholder="Trạng thái"
              className="min-w-[150px] !h-10"
              options={[
                { label: "Tất cả trạng thái", value: "all" },
                { label: "Đang bán", value: "active" },
                { label: "Đã ẩn", value: "hidden" }
              ]}
            />

            {/* Price */}
            <SWTSelect
              placeholder="Khoảng giá"
              className="min-w-[160px] !h-10"
              options={[
                { label: "Tất cả mức giá", value: "all" },
                { label: "Dưới 500.000đ", value: "under_500k" },
                { label: "500.000đ - 1.000.000đ", value: "500k_1m" },
                { label: "1.000.000đ - 2.000.000đ", value: "1m_2m" },
                { label: "Trên 2.000.000đ", value: "above_2m" }
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

      <AddVariantModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onAdd={() => onUpdate()}
      />
    </>
  );
}
