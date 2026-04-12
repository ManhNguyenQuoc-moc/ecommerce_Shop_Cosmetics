import { Tag, Tooltip } from "antd";
import { TicketPercent, Copy, Calendar, Info } from "lucide-react";
import { VoucherResponseDto as VoucherDTO } from "@/src/services/models/voucher/output.dto";
import { showNotificationSuccess } from "@/src/@core/utils/message";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

interface Props {
  voucher: VoucherDTO;
}

export default function VoucherCard({ voucher }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(voucher.code);
    showNotificationSuccess(`Đã sao chép mã: ${voucher.code}`);
  };

  const isExpired = voucher.is_expired;
  const isUsed = voucher.is_used;
  const isDisabled = isExpired || isUsed;

  return (
    <SWTCard className={`relative !mb-4 !rounded-2xl !border-none !shadow-sm overflow-hidden group transition-all ${isDisabled ? "opacity-75 grayscale-[0.5]" : "hover:shadow-md hover:border-brand-200"}`} bodyClassName="flex p-0">

      {/* Left side - Icon/Type */}
      <div className={`w-28 sm:w-32 flex flex-col items-center justify-center border-r border-dashed border-gray-100 px-4 py-6 relative ${isDisabled ? "bg-gray-50" : "bg-gradient-to-br from-brand-50 to-rose-50"}`}>
        {/* Semi-circles for ticket effect */}
        <div className="absolute -top-3 -right-3 w-6 h-6 bg-white border border-gray-100 rounded-full" />
        <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-white border border-gray-100 rounded-full" />

        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isDisabled ? "bg-gray-200 text-gray-400" : "bg-white text-brand-500 shadow-sm"}`}>
          <TicketPercent size={24} />
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-wider text-center ${isDisabled ? "text-gray-400" : "text-brand-600"}`}>
          {voucher.type === "PERCENTAGE" ? "Giảm giá %" : voucher.type === "FREE_SHIPPING" ? "Free Ship" : "Giảm tiền mặt"}
        </span>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start mb-1">
            <h3 className={`font-bold text-gray-900 text-base truncate pr-2 ${isDisabled ? "text-gray-400" : ""}`}>
              {voucher.name}
            </h3>
            {isUsed ? (
              <Tag color="default" className="!rounded-full !m-0">Đã sử dụng</Tag>
            ) : isExpired ? (
              <Tag color="error" className="!rounded-full !m-0">Hết hạn</Tag>
            ) : (
              <Tag color="success" className="!rounded-full !m-0">Sẵn sàng</Tag>
            )}
          </div>
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-3">
            {voucher.description}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
            <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
              <Calendar size={13} />
              <span>HSD: {new Date(voucher.end_date).toLocaleDateString("vi-VN")}</span>
            </div>
            {voucher.min_order_value && (
              <div className="flex items-center gap-1.5 text-gray-400 text-[11px]">
                <Info size={13} />
                <span>Đơn từ {voucher.min_order_value.toLocaleString("vi-VN")}₫</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className={`px-3 py-1.5 rounded-lg border border-dashed font-mono font-bold text-sm tracking-widest ${isDisabled ? "bg-gray-50 text-gray-400 border-gray-200" : "bg-brand-50 text-brand-600 border-brand-200"}`}>
            {voucher.code}
          </div>
          {!isDisabled && (
            <Tooltip title="Sao chép mã">
              <button
                onClick={handleCopy}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-brand-500 hover:text-white transition-all shadow-sm"
              >
                <Copy size={16} />
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </SWTCard>
  );
}
