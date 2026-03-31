import { get, post } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";

export const PURCHASE_API_ENDPOINT = "/purchases";

export interface CreatePurchaseOrderDTO {
  brandId: string;
  note?: string;
  totalAmount: number;
  items: { variantId: string; orderedQty: number; costPrice: number }[];
}

export interface CreateSupplierDTO {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}

export const getPurchaseOrders = (params?: any) => get(PURCHASE_API_ENDPOINT, params);
export const getPurchaseOrderById = (id: string) => get(`${PURCHASE_API_ENDPOINT}/${id}`);
export const getSuppliers = () => get(`${PURCHASE_API_ENDPOINT}/suppliers`);

// Fetchers for SWR Mutation
const postFetcher = (url: string, { arg }: { arg: any }) => post(url, arg);
const confirmFetcher = (url: string, { arg }: { arg: string }) => post(`${url}/${arg}/confirm`, {});

// Custom Mutation Hooks using swr/mutation
export const useCreatePurchaseOrder = () => {
  return useSWRMutation<any, any, string, CreatePurchaseOrderDTO>(PURCHASE_API_ENDPOINT, postFetcher);
};

export const useConfirmPurchaseOrder = () => {
  return useSWRMutation<any, any, string, string>(PURCHASE_API_ENDPOINT, confirmFetcher);
};

export const useCreateSupplier = () => {
  return useSWRMutation<any, any, string, CreateSupplierDTO>(`${PURCHASE_API_ENDPOINT}/suppliers`, postFetcher);
};


// Custom Query Hooks
export const usePurchaseOrders = (page: number, limit: number) => {
  const fetcher = () => getPurchaseOrders({ page, limit });
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR(
    `${PURCHASE_API_ENDPOINT}?page=${page}&limit=${limit}`,
    fetcher
  );

  return {
    orders: (data as any)?.orders || (data as any)?.data?.orders || [],
    total: (data as any)?.total || (data as any)?.data?.total || 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const usePurchaseOrderById = (id: string | null) => {
  const fetcher = () => id ? getPurchaseOrderById(id) : Promise.resolve(null);
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR(
    id ? `${PURCHASE_API_ENDPOINT}/${id}` : null,
    fetcher
  );

  return {
    po: data as any,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const useSuppliers = (shouldFetch: boolean = true) => {
  const fetcher = () => getSuppliers();
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR(
    shouldFetch ? `${PURCHASE_API_ENDPOINT}/suppliers` : null,
    fetcher
  );

  return {
    suppliers: data as any[] || [],
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};
