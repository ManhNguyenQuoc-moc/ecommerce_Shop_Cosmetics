export interface CreateVoucherDto {
  code: string;
  program_name: string;
  description?: string;
  type: "PERCENTAGE" | "FLAT_AMOUNT" | "FREE_SHIPPING";
  discount: number;
  min_order_value?: number;
  max_discount?: number;
  valid_from: string;
  valid_until: string;
  point_cost?: number;
  usage_limit: number;
  isActive?: boolean;
}

export interface UpdateVoucherDto {
  code?: string;
  program_name?: string;
  description?: string;
  type?: "PERCENTAGE" | "FLAT_AMOUNT" | "FREE_SHIPPING";
  discount?: number;
  min_order_value?: number;
  max_discount?: number;
  valid_from?: string;
  valid_until?: string;
  point_cost?: number;
  usage_limit?: number;
  isActive?: boolean;
}
