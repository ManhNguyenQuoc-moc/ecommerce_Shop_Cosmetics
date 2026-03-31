import { Download, Filter, Plus } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTDatePickerRange from "@/src/@core/component/AntD/SWTDatePickerRange";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";

export default function RewardFilters() {
  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 mb-6">
      <div className="flex-1 w-full max-w-md">
        <SWTInputSearch 
          placeholder="Tìm kiếm mã ví, khách hàng..." 
          className="w-full !rounded-xl"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        <SWTDatePickerRange />

        <SWTSelect 
          placeholder="Loại Giao Dịch"
          className="min-w-[140px] !h-10"
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Cộng điểm", value: "add" },
            { label: "Trừ điểm", value: "sub" }
          ]}
        />
        
        <SWTButton 
          type="primary" 
          className="!h-10 !w-10 !p-0 flex items-center justify-center bg-slate-100 text-slate-700 hover:bg-slate-200 border-none shadow-none"
        >
          <Filter size={18} />
        </SWTButton>
        <SWTTooltip title="Thêm Giao Dịch Điểm" placement="top" color="#f59e0b">
          <div 
            className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-amber-500/20 hover:bg-amber-50 dark:hover:bg-amber-500/30 text-amber-600 dark:text-orange-400 border border-slate-200 dark:border-amber-500 rounded-xl shadow-sm transition-all cursor-pointer group"
          >
            <Plus size={20} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
          </div>
        </SWTTooltip>
      </div>
    </div>
  );
}
