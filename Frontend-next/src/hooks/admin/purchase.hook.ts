import { get } from "@/src/services/api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { CreatePOInput, UpdatePOInput, POQueryParams } from "@/src/services/models/purchase/input.dto";
import { PODetailDto, POListItemDto } from "@/src/services/models/purchase/output.dto";
import { PaginationResponse } from "@/src/@core/http/models/PaginationResponse";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { getPurchaseOrders, getPurchaseOrderById } from "@/src/services/admin/purchase.service";

export const PURCHASE_API_ENDPOINT = "/purchases";

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
