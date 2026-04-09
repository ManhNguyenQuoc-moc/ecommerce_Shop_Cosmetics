import { SWRConfiguration } from "swr";
import { get } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";

export const BRAND_API_ENDPOINT = "/brands";

export const useCustomerBrands = (page: number = 1, pageSize: number = 10, category?: string, options?: SWRConfiguration) => {
  const query = new URLSearchParams();
  query.append("page", page.toString());
  query.append("pageSize", pageSize.toString());
  if (category) query.append("category", category);

  const url = `${BRAND_API_ENDPOINT}?${query.toString()}`;

  const { data, isLoading, error, mutate } = useFetchSWR(
    url,
    () => get(url),
    options
  );

  const brands = (data as any)?.data || (Array.isArray(data) ? data : []);
  const total = (data as any)?.total || brands.length;

  return {
    brands,
    total,
    isLoading,
    isError: error,
    mutate
  };
};
