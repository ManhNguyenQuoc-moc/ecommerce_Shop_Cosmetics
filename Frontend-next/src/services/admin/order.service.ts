// order.service.ts
import { get, put } from "../../@core/utils/api";
import { OrderDto, OrderListResponseDto } from "../models/order/output.dto";
import { buildQueryString } from "../../@core/utils/query.util";

export const ORDER_API_ENDPOINT = "/orders";

export interface OrderQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const getOrders = (params: OrderQueryParams) => {
  const query = buildQueryString(params);
  const url = `${ORDER_API_ENDPOINT}${query}`;
  return get<OrderListResponseDto>(url);
};

export const getOrderById = (id: string) => {
  return get<OrderDto>(`${ORDER_API_ENDPOINT}/${id}`);
};

export const updateOrderStatus = (id: string, status: string, note?: string) => {
  return put(`${ORDER_API_ENDPOINT}/${id}`, { current_status: status, note });
};

export const updateOrderPaymentStatus = (id: string, paymentStatus: 'PAID' | 'UNPAID') => {
  return put(`${ORDER_API_ENDPOINT}/${id}`, { payment_status: paymentStatus });
};
