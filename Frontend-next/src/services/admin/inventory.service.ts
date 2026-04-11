import { get } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { InventoryBatchDto } from "../models/inventory/output.dto";
import { InventoryQueryParams } from "../models/inventory/input.dto";
import { buildQueryString } from "../../utils/query.util";
import { PaginationResponse } from "../models/common/PaginationResponse";

export const INVENTORY_API_ENDPOINT = "/inventory";

export function useInventoryBatches(page: number, pageSize: number, filters?: InventoryQueryParams) {
  const query = buildQueryString({
    page,
    pageSize,
    ...filters
  });

  const url = `${INVENTORY_API_ENDPOINT}/batches${query}`;
  
  const { data, error, isLoading, mutate } = useFetchSWR<PaginationResponse<InventoryBatchDto>>(
    url,
    () => get<PaginationResponse<InventoryBatchDto>>(url)
  );

  return {
    batches: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}
