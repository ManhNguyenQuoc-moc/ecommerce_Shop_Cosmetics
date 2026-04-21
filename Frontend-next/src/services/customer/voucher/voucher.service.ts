import http from "../../../@core/http";
import { VoucherResponseDto as VoucherDTO, VoucherType } from "../../models/voucher/output.dto";

const path = "/vouchers";

interface RawVoucherResponse {
  id: string;
  code: string;
  program_name: string | null;
  description: string | null;
  type: string;
  discount: number;
  min_order_value: number | null;
  max_discount: number | null;
  valid_from: string;
  valid_until: string;
  point_cost: number;
  used_count: number;
  usage_limit: number;
  isActive: boolean;
  is_used_by_user?: boolean;
}

interface PaginatedVoucherResponse {
  success: boolean;
  data: {
    data: RawVoucherResponse[];
    total: number;
    page: number;
    pageSize: number;
  };
}

export const getVouchers = async (includeExpired: boolean = true): Promise<VoucherDTO[]> => {
  try {
    const queryParam = includeExpired ? "?includeExpired=true" : "";
    const response = await http.get<PaginatedVoucherResponse>(`${path}${queryParam}`);
    
    console.log("API Response:", response.data);
    
    // Extract vouchers from response structure
    const voucherList = response.data?.data?.data || [];
    console.log("Extracted vouchers:", voucherList);
    
    const mappedVouchers = voucherList.map(v => ({
        id: v.id,
        code: v.code,
        program_name: v.program_name || null,
        description: v.description || null,
        type: v.type as VoucherType,
        discount: v.discount,
        min_order_value: v.min_order_value || null,
        max_discount: v.max_discount || null,
        valid_from: v.valid_from,
        valid_until: v.valid_until,
        point_cost: v.point_cost || 0,
        used_count: v.used_count || 0,
        usage_limit: v.usage_limit || 0,
        isActive: v.isActive ?? true,
        is_used_by_user: v.is_used_by_user ?? false,
    }));
    
    console.log("Mapped vouchers:", mappedVouchers);
    return mappedVouchers;
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    return [];
  }
};

export const getVoucherByCode = async (code: string): Promise<VoucherDTO | null> => {
  try {
    const response = await http.get<{ success: boolean; data: RawVoucherResponse }>(`${path}/${code}`);
    const v = response.data?.data;
    if (!v) return null;
    return {
        id: v.id,
        code: v.code,
        program_name: v.program_name || null,
        description: v.description || null,
        type: v.type as VoucherType,
        discount: v.discount,
        min_order_value: v.min_order_value || null,
        max_discount: v.max_discount || null,
        valid_from: v.valid_from,
        valid_until: v.valid_until,
        point_cost: v.point_cost || 0,
        used_count: v.used_count || 0,
        usage_limit: v.usage_limit || 0,
        isActive: v.isActive ?? true,
        is_used_by_user: v.is_used_by_user ?? false,
    };
  } catch (error) {
    console.error("Failed to fetch voucher by code:", error);
    if ((error as { status?: number })?.status === 404) {
      return null;
    }

    throw error;
  }
};
