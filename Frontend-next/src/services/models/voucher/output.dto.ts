export type VoucherType = "PERCENTAGE" | "FLAT_AMOUNT" | "FREE_SHIPPING";

export interface VoucherResponseDto {
  id: string;
  code: string;
  program_name: string | null;
  description: string | null;
  type: VoucherType;
  discount: number;
  min_order_value: number | null;
  max_discount: number | null;
  valid_from: string | Date;
  valid_until: string | Date;
  point_cost: number;
  used_count: number;
  usage_limit: number;
  isActive: boolean;
  is_used_by_user?: boolean;
}

// Alias for backward compatibility if needed in customer services
export type VoucherDTO = VoucherResponseDto;
