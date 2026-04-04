import { get, post, put } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { CreatePOInput, UpdatePOInput, POQueryParams } from "../models/purchase/input.dto";
import { PODetailDto, POListItemDto } from "../models/purchase/output.dto";
import { PaginationResponse } from "../models/common/PaginationResponse";

export const PURCHASE_API_ENDPOINT = "/purchases";

export const getPurchaseOrders = (params?: POQueryParams) =>
  get<PaginationResponse<POListItemDto>>(PURCHASE_API_ENDPOINT, params);

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
  const query: POQueryParams = { page, limit, ...filters };
  const key = `${PURCHASE_API_ENDPOINT}?page=${page}&limit=${limit}&status=${filters?.status ?? ''}&search=${filters?.search ?? ''}&brandId=${filters?.brandId ?? ''}&sortBy=${filters?.sortBy ?? ''}`;

  const fetcher = () => getPurchaseOrders(query);
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PaginationResponse<POListItemDto>>(key, fetcher);

  return {
    orders: (data?.data ?? []) as POListItemDto[],
    total: data?.total ?? 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const usePurchaseOrderItems = (id: string | null, page: number, limit: number) => {
  const key = id ? `${PURCHASE_API_ENDPOINT}/${id}/items?page=${page}&limit=${limit}` : null;
  const fetcher = () => get<PaginationResponse<any>>(`${PURCHASE_API_ENDPOINT}/${id}/items`, { page, limit });
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PaginationResponse<any>>(key, fetcher);
  console.log("Fetching PO Items with key:", data);
  return {
    items: (data?.data ?? []) as any[],
    total: data?.total ?? 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const usePurchaseOrderReceipts = (id: string | null, page: number, limit: number) => {
  const key = id ? `${PURCHASE_API_ENDPOINT}/${id}/receipts?page=${page}&limit=${limit}` : null;
  const fetcher = () => get<PaginationResponse<any>>(`${PURCHASE_API_ENDPOINT}/${id}/receipts`, { page, limit });
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PaginationResponse<any>>(key, fetcher);

  return {
    receipts: (data?.data ?? []) as any[],
    total: data?.total ?? 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const usePurchaseOrderById = (id: string | null) => {
  const fetcher = () => (id ? getPurchaseOrderById(id) : Promise.resolve(null));
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PODetailDto | null>(
    id ? `${PURCHASE_API_ENDPOINT}/${id}` : null,
    fetcher
  );

  // get<T> already returns res.data.data — so `data` IS the PODetailDto directly
  return {
    po: (data ?? null) as PODetailDto | null,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};
