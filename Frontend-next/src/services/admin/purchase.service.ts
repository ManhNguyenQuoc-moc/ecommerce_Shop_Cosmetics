import { get, post, put } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { CreatePOInput, UpdatePOInput, POQueryParams } from "../models/purchase/input.dto";
import { PODetailDto, POListItemDto } from "../models/purchase/output.dto";
import { PaginationResponse } from "../models/common/PaginationResponse";
import { buildQueryString } from "../../utils/query.util";

export const PURCHASE_API_ENDPOINT = "/purchases";

export const getPurchaseOrders = (params?: POQueryParams) => {
  const query = params ? buildQueryString(params) : "";
  return get<PaginationResponse<POListItemDto>>(`${PURCHASE_API_ENDPOINT}${query}`);
};

export const getPurchaseOrderById = (id: string) =>
  get<PODetailDto>(`${PURCHASE_API_ENDPOINT}/${id}`);

export const createPurchaseOrder = (data: CreatePOInput) => post<PODetailDto>(PURCHASE_API_ENDPOINT, data);

export const updatePurchaseOrder = (id: string, data: UpdatePOInput) =>
  put<PODetailDto>(`${PURCHASE_API_ENDPOINT}/${id}`, data);

export const confirmPurchaseOrder = (id: string) =>
  post(`${PURCHASE_API_ENDPOINT}/${id}/confirm`, {});

export const cancelPurchaseOrder = (id: string) =>
  post(`${PURCHASE_API_ENDPOINT}/${id}/cancel`, {});

export const receiveStock = (payload: any) =>
  post(`${PURCHASE_API_ENDPOINT}/receive-stock`, payload);

// --- Query Hooks ---
export const usePurchaseOrders = (page: number, limit: number, filters?: POQueryParams) => {
  const queryObj = { page, limit, ...filters };
  const query = buildQueryString(queryObj);
  const url = `${PURCHASE_API_ENDPOINT}${query}`;

  const fetcher = () => getPurchaseOrders(queryObj);
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PaginationResponse<POListItemDto>>(url, fetcher);

  return {
    orders: data?.data || [],
    total: data?.total || 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const usePurchaseOrderItems = (id: string | null, page: number, limit: number) => {
  const queryObj = { page, limit };
  const query = buildQueryString(queryObj);
  const url = id ? `${PURCHASE_API_ENDPOINT}/${id}/items${query}` : null;
  
  const fetcher = () => get<PaginationResponse<any>>(`${PURCHASE_API_ENDPOINT}/${id}/items`, queryObj);
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PaginationResponse<any>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });
  return {
    items: data?.data || [],
    total: data?.total || 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const usePurchaseOrderReceipts = (id: string | null, page: number, limit: number) => {
  const queryObj = { page, limit };
  const query = buildQueryString(queryObj);
  const url = id ? `${PURCHASE_API_ENDPOINT}/${id}/receipts${query}` : null;

  const fetcher = () => get<PaginationResponse<any>>(`${PURCHASE_API_ENDPOINT}/${id}/receipts`, queryObj);
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PaginationResponse<any>>(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    receipts: data?.data || [],
    total: data?.total || 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const usePurchaseOrderById = (id: string | null) => {
  const url = id ? `${PURCHASE_API_ENDPOINT}/${id}` : null;
  const fetcher = () => (id ? getPurchaseOrderById(id) : Promise.resolve(null));
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PODetailDto | null>(
    url,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  return {
    po: data || null,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};
