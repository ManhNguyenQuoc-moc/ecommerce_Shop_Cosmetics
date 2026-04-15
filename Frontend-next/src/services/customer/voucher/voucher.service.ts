import { get } from "../../../@core/utils/api";
import { VoucherResponseDto as VoucherDTO } from "../../models/voucher/output.dto";

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
        point_cost: v.point_cost || 0,
        used_count: v.used_count || 0,
        usage_limit: v.usage_limit || 0,
        is_used: v.is_used_by_user ?? (v.used_count >= v.usage_limit),
        is_expired: new Date(v.valid_until) < new Date(),
    }));
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    return [];
  }
};
export const getVoucherByCode = async (code: string): Promise<VoucherDTO | null> => {
  try {
    const v = await get<any>(`${path}/${code}`);
    if (!v) return null;
    return {
        id: v.id,
        code: v.code,
        name: v.program_name || `Giảm ${v.discount}${v.type === 'PERCENTAGE' ? '%' : 'đ'}`,
        description: v.description || "Áp dụng cho đơn hàng",
        type: v.type,
        value: v.discount,
        min_order_value: v.min_order_value || 0,
        max_discount_amount: v.max_discount || undefined,
        start_date: v.valid_from,
        end_date: v.valid_until,
        point_cost: v.point_cost || 0,
        used_count: v.used_count || 0,
        usage_limit: v.usage_limit || 0,
        is_used: v.is_used_by_user ?? (v.used_count >= v.usage_limit),
        is_expired: new Date(v.valid_until) < new Date(),
    };
  } catch (error) {
    console.error("Failed to fetch voucher by code:", error);
    return null;
  }
};
