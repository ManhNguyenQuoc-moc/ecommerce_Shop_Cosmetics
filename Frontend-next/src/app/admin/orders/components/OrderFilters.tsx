import { Download, Filter } from "lucide-react";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { SWTInputSearch } from "@/src/@core/component/AntD/SWTInput";
import SWTSelect from "@/src/@core/component/AntD/SWTSelect";
import SWTDatePickerRange from "@/src/@core/component/AntD/SWTDatePickerRange";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import { OrderQueryParams } from "@/src/services/admin/order/order.service";
import { PaymentStatus } from "@/src/enums";

interface OrderFiltersProps {
  params: OrderQueryParams;
  onParamChange: (newParams: Partial<OrderQueryParams>) => void;
  onClear: () => void;
}

export default function OrderFilters({ params, onParamChange, onClear }: OrderFiltersProps) {
  const sortByVal = params.sortBy || "newest";
  const paymentStatusVal = params.paymentStatus || "all";
  const paymentMethodVal = params.paymentMethod || "all";

  return (
    <div className="flex flex-col gap-5 mb-6">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5">
        <div className="flex-1 w-full max-w-2xl">
          <SWTInputSearch 
            placeholder="Tìm kiếm mã đơn, tên khách hàng..." 
            className="w-full h-11! rounded-2xl! shadow-sm"
            value={params.searchTerm}
            onChange={(e) => onParamChange({ searchTerm: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="flex items-center gap-2 rounded-xl px-1 h-11">
            <span className="text-sm font-bold text-text-muted pl-3">
              Sắp xếp:
            </span>
            <SWTSelect
              placeholder="Sắp xếp theo"
              className="min-w-47.5 h-full! [&_.ant-select-selector]:bg-transparent! [&_.ant-select-selector]:border-none! [&_.ant-select-selector]:shadow-none!"
              value={sortByVal}
              onChange={(value) => onParamChange({ sortBy: value })}
              options={[
                { label: "Ngày đặt: Mới nhất", value: "newest" },
                { label: "Ngày đặt: Cũ nhất", value: "oldest" },
                { label: "Tổng tiền: Cao nhất", value: "amount_desc" },
                { label: "Tổng tiền: Thấp nhất", value: "amount_asc" },
              ]}
            />
          </div>

          <SWTTooltip title="Xuất báo cáo đơn hàng" placement="top">
            <div className="flex h-11 w-11 items-center justify-center bg-white dark:bg-slate-900/50 hover:bg-emerald-50 dark:hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-slate-200 dark:border-emerald-500/50 rounded-xl shadow-sm transition-all cursor-pointer group">
              <Download size={20} className="group-hover:scale-110 transition-transform duration-300" />
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

          <SWTSelect
            placeholder="Trạng thái thanh toán"
            className="w-full sm:w-47.5 h-11!"
            value={paymentStatusVal}
            onChange={(value) => onParamChange({ paymentStatus: value })}
            options={[
              { label: "Tất cả thanh toán", value: "all" },
              { label: "Đã thanh toán", value: PaymentStatus.PAID },
              { label: "Chưa thanh toán", value: PaymentStatus.UNPAID },
              { label: "Đã hoàn tiền", value: PaymentStatus.REFUNDED },
            ]}
          />

          <SWTSelect
            placeholder="Phương thức thanh toán"
            className="w-full sm:w-47.5 h-11!"
            value={paymentMethodVal}
            onChange={(value) => onParamChange({ paymentMethod: value })}
            options={[
              { label: "Tất cả phương thức", value: "all" },
              { label: "COD", value: "COD" },
              { label: "MOMO", value: "MOMO" },
              { label: "ZALOPAY", value: "ZALOPAY" },
              { label: "SEPAY", value: "SEPAY" },
            ]}
          />

          <div className="flex flex-wrap items-center gap-3 flex-1">
            <SWTDatePickerRange 
              className="h-11! rounded-xl! w-full sm:w-auto" 
                onChange={(dates, dateStrings) => {
                    onParamChange({
                        startDate: dateStrings[0] || undefined,
                        endDate: dateStrings[1] || undefined,
                    });
                }}
            />
          </div>
        </div>

        <div className="w-full md:w-auto flex justify-end md:justify-start border-t md:border-t-0 border-slate-100 dark:border-slate-700/50 pt-3 md:pt-0">
          <SWTButton
            type="text"
            onClick={onClear}
            className="h-9! px-4! text-xs! rounded-xl! w-auto! whitespace-nowrap
            text-slate-400 hover:text-red-500! hover:bg-red-50! dark:hover:bg-red-500/10! transition-all font-bold"
          >
            Xóa bộ lọc
          </SWTButton>
        </div>
      </div>
    </div>
  );
}
