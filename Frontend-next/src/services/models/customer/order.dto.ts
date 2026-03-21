export interface OrderItemDTO {
  id: string;
  product_name: string;
  product_image: string;
  variant_name?: string;
  price: number;
  quantity: number;
}

export type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPING" | "COMPLETED" | "CANCELLED" | "RETURNED";

export interface OrderDTO {
  id: string;
  order_code: string;
  status: OrderStatus;
  created_at: string;
  total_amount: number;
  items: OrderItemDTO[];
  payment_method: string;
  shipping_address: string;
}

export interface OrderListResponseDTO {
  data: OrderDTO[];
  total: number;
}
