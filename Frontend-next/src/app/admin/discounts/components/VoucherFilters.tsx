import { Download, Filter, Plus } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";

interface VoucherFiltersProps {
  onAdd?: () => void;
}

export default function VoucherFilters({ onAdd }: VoucherFiltersProps) {
  return (
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch 
            placeholder="Tìm kiếm mã voucher, tên chương trình..." 
            className="w-full !h-11 !rounded-2xl shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <SWTTooltip title="Xuất dữ liệu voucher" placement="top">
            <div className="flex h-11 w-11 items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-slate-700/50 rounded-xl shadow-sm transition-all cursor-pointer group">
              <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
            </div>
          </SWTTooltip>
          <SWTTooltip title="Thêm Voucher Mới" placement="top" color="#6366f1">
            <div 
              onClick={onAdd}
              className="flex h-11 w-11 items-center justify-center bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/30 rounded-xl shadow-sm transition-all cursor-pointer group"
            >
              <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
            </div>
          </SWTTooltip>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 w-full p-4 lg:p-5 transition-all duration-300">
        
        <div className="flex flex-wrap items-center gap-3 flex-1 w-full">
          <div className="flex items-center gap-2 text-brand-600 dark:text-admin-accent 
          font-bold md:pr-4 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700 pb-2 md:pb-0 w-full md:w-auto">
            <Filter size={18} className="text-brand-500" />
            <span className="text-xs uppercase tracking-widest whitespace-nowrap">Bộ lọc</span>
          </div>

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SWTSelect 
              placeholder="Trạng thái"
              className="w-full sm:w-[180px] !h-11"
              options={[
                { label: "Tất cả", value: "all" },
                { label: "Hoạt động / Diễn ra", value: "active" },
                { label: "Hết lượt", value: "out" },
                { label: "Chờ kích hoạt", value: "pending" }
              ]}
            />
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-end md:justify-start border-t md:border-t-0 border-slate-100 dark:border-slate-700/50 pt-3 md:pt-0">
          <SWTButton
            type="text"
            className="!h-9 !px-4 !text-xs !rounded-xl !w-auto whitespace-nowrap
            text-slate-400 hover:!text-red-500 hover:!bg-red-50 dark:hover:!bg-red-500/10 transition-all font-bold"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
  );
}
