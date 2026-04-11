export type VoucherType = "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING";

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
  is_used: boolean;
  is_expired: boolean;
}

// Alias for backward compatibility if needed in customer services
export type VoucherDTO = VoucherResponseDto;
