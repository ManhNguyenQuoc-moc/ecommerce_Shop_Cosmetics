export type VoucherType = "PERCENTAGE" | "FLAT_AMOUNT" | "FREE_SHIPPING";

export interface VoucherResponseDto {
  id: string;
  code: string;
  name: string;
  description: string;
  type: VoucherType;
  value: number;
  min_order_value?: number;
  max_discount_amount?: number;
  start_date: string;
  end_date: string;
  point_cost?: number;
  is_used: boolean;
  is_expired: boolean;
  used_count: number;
  usage_limit: number;
  is_used_by_user?: boolean;
  valid_from?: string;
  valid_until?: string;
}

// Alias for backward compatibility if needed in customer services
export type VoucherDTO = VoucherResponseDto;
