import { get, post } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";

export const INVENTORY_API_ENDPOINT = "/inventory";

export interface ReceiveStockDTO {
  poId: string;
  variantId: string;
  batchNumber: string;
  expiryDate: string | Date;
  manufacturingDate?: string | Date;
  quantity: number;
  costPrice: number;
  note?: string;
}

export const getBatches = (params?: any) => get(`${INVENTORY_API_ENDPOINT}/batches`, params);
export const getTransactions = (params?: any) => get(`${INVENTORY_API_ENDPOINT}/transactions`, params);

// Fetchers for SWR Mutation
const postFetcher = (url: string, { arg }: { arg: any }) => post(url, arg);

export const useReceiveStock = () => {
  return useSWRMutation<any, any, string, ReceiveStockDTO>(`${INVENTORY_API_ENDPOINT}/receive`, postFetcher);
};

export const useInventoryBatches = (page: number, limit: number) => {
  const fetcher = () => getBatches({ page, limit });
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR(
    `${INVENTORY_API_ENDPOINT}/batches?page=${page}&limit=${limit}`,
    fetcher
  );

  return {
    batches: (data as any)?.batches || (data as any)?.data?.batches || [],
    total: (data as any)?.total || (data as any)?.data?.total || 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};
