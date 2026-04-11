import { get } from "../api";
import { VoucherResponseDto as VoucherDTO } from "../models/voucher/output.dto";

const path = "/vouchers";

export const getVouchers = async (): Promise<VoucherDTO[]> => {
  try {
    const data = await get<any[]>(path);
    return data.map(v => ({
        id: v.id,
        code: v.code,
        name: v.name || `Giảm ${v.discount}${v.type === 'PERCENTAGE' ? '%' : 'đ'}`,
        description: v.description || "Áp dụng cho đơn hàng",
        type: v.type,
        value: v.discount,
        min_order_value: v.min_order_value || 0,
        start_date: v.valid_from,
        end_date: v.valid_until,
        is_used: v.used_count >= v.usage_limit,
        is_expired: new Date(v.valid_until) < new Date(),
    }));
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    return [];
  }
};
