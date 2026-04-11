// order.service.ts
import { get, put } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { OrderDto, OrderListResponseDto } from "../models/order/output.dto";
import { buildQueryString } from "../../utils/query.util";

export const ORDER_API_ENDPOINT = "/orders";

export interface OrderQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export const useOrders = (params: OrderQueryParams) => {
  const query = buildQueryString(params);
  const url = `${ORDER_API_ENDPOINT}${query}`;
  
  const fetcher = () => get<OrderListResponseDto>(url);
  const { data, error, isLoading, mutate } = useFetchSWR<OrderListResponseDto>(
    url,
    fetcher
  );

  return {
    orders: data?.data || [],
    total: data?.total || 0,
    page: data?.page || params.page,
    pageSize: data?.pageSize || params.pageSize,
    isLoading,
    isError: error,
    mutate,
  };
};

export const useOrder = (id: string | undefined) => {
  const fetcher = () => id ? get<OrderDto>(`${ORDER_API_ENDPOINT}/${id}`) : Promise.reject("No ID");

  const { data, error, isLoading, mutate } = useFetchSWR<OrderDto>(
    id ? `${ORDER_API_ENDPOINT}/${id}` : null,
    fetcher
  );

  return {
    order: data || null,
    isLoading,
    isError: error,
    mutate,
  };
};

export const updateOrderStatus = (id: string, status: string, note?: string) => {
  return put(`${ORDER_API_ENDPOINT}/${id}`, { current_status: status, note });
};

export const updateOrderPaymentStatus = (id: string, paymentStatus: 'PAID' | 'UNPAID') => {
  return put(`${ORDER_API_ENDPOINT}/${id}`, { payment_status: paymentStatus });
};
