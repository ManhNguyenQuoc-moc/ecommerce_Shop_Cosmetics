import { Download, Filter } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";

export default function VariantFilters() {
  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 mb-6">
      <div className="flex-1 w-full max-w-md">
        <SWTInputSearch 
          placeholder="Tìm kiếm biến thể..." 
          className="w-full !rounded-xl"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        
        <SWTSelect 
          placeholder="Phân loại"
          className="min-w-[140px] !h-10"
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Màu sắc", value: "color" },
            { label: "Dung tích", value: "volume" },
            { label: "Kích thước", value: "size" }
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
