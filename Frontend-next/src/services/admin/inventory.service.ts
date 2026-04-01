import { get, post } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { ReceiveStockInput } from "../models/purchase/input.dto";

export const INVENTORY_API_ENDPOINT = "/inventory";
export const PURCHASE_API_ENDPOINT = "/purchases";

export const getBatches = (params?: Record<string, unknown>) =>
  get(`${INVENTORY_API_ENDPOINT}/batches`, params);

export const getTransactions = (params?: Record<string, unknown>) =>
  get(`${INVENTORY_API_ENDPOINT}/transactions`, params);

export const receiveStock = (payload: ReceiveStockInput) =>
  post(`${PURCHASE_API_ENDPOINT}/receive-stock`, payload);

export const useInventoryBatches = (page: number, limit: number) => {
  const fetcher = () => getBatches({ page, limit });
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR(
    `${INVENTORY_API_ENDPOINT}/batches?page=${page}&limit=${limit}`,
    fetcher
  );

  const responseData = data as { batches?: unknown[]; data?: { batches?: unknown[]; total?: number }; total?: number } | null;

  return {
    batches: responseData?.batches ?? responseData?.data?.batches ?? [],
    total: responseData?.total ?? responseData?.data?.total ?? 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};
