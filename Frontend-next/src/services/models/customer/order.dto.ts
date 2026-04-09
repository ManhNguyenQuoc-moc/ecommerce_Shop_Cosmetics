export interface OrderItemDTO {
  id: string;
  variantId: string;
  product_name: string;
  product_image: string;
  variant_name?: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPING" | "DELIVERED" | "CANCELLED" | "RETURNED";

export interface OrderDTO {
  id: string;
  code: string;
  current_status: OrderStatus;
  createdAt: string;
  total_amount: number;
  final_amount: number;
  items: OrderItemDTO[];
  payment_method: string;
  payment_status: string;
  shipping_address: string;
}

export interface OrderListResponseDTO {
  data: OrderDTO[];
  total: number;
}
