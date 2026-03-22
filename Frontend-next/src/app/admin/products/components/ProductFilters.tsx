import { Filter, Plus } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";

export default function ProductFilters() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
      <div className="flex-1 w-full max-w-md">
        <SWTInputSearch 
          placeholder="Tìm kiếm tên sản phẩm, mã SKU..." 
          className="w-full !rounded-xl"
        />
      </div>
      
      <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
        <SWTSelect 
          placeholder="Danh mục"
          className="min-w-[140px] !h-10"
          options={[
            { label: "Chăm sóc da", value: "skincare" },
            { label: "Trang điểm", value: "makeup" },
            { label: "Nước hoa", value: "fragrance" }
          ]}
        />
        <SWTSelect 
          placeholder="Trạng thái"
          className="min-w-[140px] !h-10"
          options={[
            { label: "Đang bán", value: "active" },
            { label: "Hết hàng", value: "out_of_stock" },
            { label: "Đã ẩn", value: "hidden" }
          ]}
        />
        
        <SWTButton 
          type="primary" 
          className="!h-10 !w-auto bg-slate-100 text-slate-700 hover:bg-slate-200 border-none shadow-none"
          startIcon={<Filter size={18} />}
        >
          Lọc nâng cao
        </SWTButton>
        <SWTButton 
          type="primary" 
          className="!h-10 !w-auto bg-brand-600 hover:bg-brand-700 !px-5"
          startIcon={<Plus size={18} />}
        >
          Thêm sản phẩm
        </SWTButton>
      </div>
    </div>
  );
}
