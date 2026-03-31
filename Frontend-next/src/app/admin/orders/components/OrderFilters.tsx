import { Download, Filter, Plus } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTDatePickerRange from "@/src/@core/component/AntD/SWTDatePickerRange";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";

export default function OrderFilters() {
  return (
    <div className="flex flex-col xl:flex-row items-start xl:items-center gap-4 mb-6">
      <div className="flex-1 w-full max-w-md">
        <SWTInputSearch 
          placeholder="Tìm kiếm mã đơn, tên khách hàng..." 
          className="w-full !rounded-xl"
        />
      </div>
      
      <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
        <SWTDatePickerRange />
        
        <SWTSelect 
          placeholder="Trạng thái"
          className="min-w-[140px] !h-10"
          options={[
            { label: "Tất cả", value: "all" },
            { label: "Chờ xác nhận", value: "pending" },
            { label: "Đang xử lý", value: "processing" },
            { label: "Đang giao", value: "shipping" },
            { label: "Đã giao", value: "delivered" },
            { label: "Đã hủy", value: "cancelled" }
          ]}
        />
        
        <SWTButton 
          type="primary" 
          className="!h-10 !w-auto bg-slate-100 text-slate-700 hover:bg-slate-200 border-none shadow-none"
          startIcon={<Filter size={18} />}
        >
          Lọc
        </SWTButton>
        <SWTTooltip title="Tạo Đơn Hàng Mới" placement="top" color="#3b82f6">
          <div 
            className="flex h-[35px] w-[35px] items-center justify-center bg-white dark:bg-blue-500/20 hover:bg-blue-50 dark:hover:bg-blue-500/30 text-blue-600 dark:text-blue-400 border border-slate-200 dark:border-blue-500 rounded-xl shadow-sm transition-all cursor-pointer group"
          >
            <Plus size={20} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
          </div>
        </SWTTooltip>
      </div>
    </div>
  );
}
