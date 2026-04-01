import { get, post, put } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { CreatePOInput, UpdatePOInput, POQueryParams } from "../models/purchase/input.dto";
import { PODetailDto, POListItemDto, POListResponseDto } from "../models/purchase/output.dto";

export const PURCHASE_API_ENDPOINT = "/purchases";

// --- Raw fetchers ---
export const getPurchaseOrders = (params?: POQueryParams) =>
  get<POListResponseDto>(PURCHASE_API_ENDPOINT, params);

export const getPurchaseOrderById = (id: string) =>
  get<PODetailDto>(`${PURCHASE_API_ENDPOINT}/${id}`);

// --- Mutation (plain) functions - follow product.service pattern (no useSWRMutation)
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
  // Build a stable cache key from params
  const key = `${PURCHASE_API_ENDPOINT}?page=${page}&limit=${limit}&status=${filters?.status ?? ''}&search=${filters?.search ?? ''}&brandId=${filters?.brandId ?? ''}&sortBy=${filters?.sortBy ?? ''}`;

  const fetcher = () => getPurchaseOrders(query);
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<POListResponseDto>(key, fetcher);

  // get<T> already returns res.data.data — so `data` IS the POListResponseDto directly
  return {
    orders: (data?.orders ?? []) as POListItemDto[],
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
