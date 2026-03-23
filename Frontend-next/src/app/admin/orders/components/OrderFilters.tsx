import { Download, Filter } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTDatePickerRange from "@/src/@core/component/AntD/SWTDatePickerRange";

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
        <SWTButton 
          type="primary" 
          className="!h-10 !w-auto bg-white text-brand-600 border border-brand-200 hover:bg-brand-50 hover:border-brand-300 ml-auto xl:ml-0"
          startIcon={<Download size={18} />}
        >
          Xuất dữ liệu
        </SWTButton>
      </div>
    </div>
  );
}
