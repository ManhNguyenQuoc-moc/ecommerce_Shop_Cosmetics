import { get } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { InventoryBatchDto } from "../models/inventory/output.dto";
import { InventoryQueryParams } from "../models/inventory/input.dto";

export const INVENTORY_API_ENDPOINT = "/inventory";

const fetcher = (url: string) => get(url).then((res: any) => res);

export function useInventoryBatches(page: number, pageSize: number, filters?: InventoryQueryParams) {
  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(filters?.search && { search: filters.search }),
    ...(filters?.categoryId && filters.categoryId !== "all" && { categoryId: filters.categoryId }),
    ...(filters?.status && filters.status !== "all" && { status: filters.status }),
    ...(filters?.sortBy && { sortBy: filters.sortBy }),
  });

  const url = `${INVENTORY_API_ENDPOINT}/batches?${query.toString()}`;
  
  const { data, error, isLoading, mutate } = useFetchSWR(
    url,
    () => fetcher(url)
  );

  return {
    batches: (data?.items || []) as InventoryBatchDto[],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}
