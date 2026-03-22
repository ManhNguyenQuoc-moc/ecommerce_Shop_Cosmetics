import { Download, Filter } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTDatePickerRange from "@/src/@core/component/AntD/SWTDatePickerRange";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";

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
        <div className="h-10 border border-slate-200 rounded-lg overflow-hidden flex items-center bg-white px-1">
          <SWTDatePickerRange style={{ border: 'none', boxShadow: 'none' }} />
        </div>

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
        <SWTButton 
          type="primary" 
          className="!h-10 !w-10 !p-0 flex items-center justify-center bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 hover:border-brand-300 ml-auto xl:ml-0"
        >
          <Download size={18} />
        </SWTButton>
      </div>
    </div>
  );
}
