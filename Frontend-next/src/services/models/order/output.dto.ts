// order.output.dto.ts

import { OrderStatus, PaymentStatus } from "@/src/enums";

export type OrderStatusType = `${OrderStatus}`;
export type PaymentStatusType = `${PaymentStatus}`;

export interface OrderItemDto {
  id: string;
  orderId: string;
  variantId: string;
  quantity: number;
  price: number;
  variant: {
    id: string;
    sku: string;
    color?: string | null;
    size?: string | null;
    image?: string | null;
    price?: number;
    product: {
      id: string;
      name: string;
      slug: string;
    };
  };
}

export interface OrderStatusHistoryDto {
  id: string;
  orderId: string;
  status: OrderStatus;
  note?: string;
  createdAt: string;
}

export interface OrderDto {
  id: string;
  code: string;
  userId?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  total_amount: number;
  shipping_fee: number;
  shipping_method: string;
  final_amount: number;
  current_status: OrderStatus;
  payment_method: string;
  payment_status: string;
  note?: string;
  discount_amount?: number;
  voucher_code?: string;
  voucher_name?: string;
  createdAt: string;
  updatedAt: string;
  
  user?: {
    id: string;
    full_name_?: string;
    full_name: string;
    email: string;
  } | null;
  
  items: OrderItemDto[];
  status_history: OrderStatusHistoryDto[];
}

export interface OrderListResponseDto {
  data: OrderDto[];
  total: number;
  page: number;
  pageSize: number;
}
