import { get, post, put, del } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";

export const BRAND_API_ENDPOINT = "/brands";

export const useBrands = (page: number | null = null, pageSize: number | null = null, filters: any = {}) => {
  const query = new URLSearchParams();
  if (page) query.append("page", page.toString());
  if (pageSize) query.append("pageSize", pageSize.toString());
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) query.append(key, String(value));
  });

  const { data, isLoading, error, mutate } = useFetchSWR(
    `${BRAND_API_ENDPOINT}?${query.toString()}`,
    () => get(`${BRAND_API_ENDPOINT}?${query.toString()}`)
  );

  const brands = Array.isArray(data) ? data : (data as any)?.items || [];
  const total = Array.isArray(data) ? data.length : (data as any)?.total || 0;

  return {
    brands,
    total,
    isLoading,
    isError: error,
    mutate
  };
};

export const useCreateBrand = () => {
  return useSWRMutation(BRAND_API_ENDPOINT, (_, { arg }: { arg: any }) => post(BRAND_API_ENDPOINT, arg));
};

export const useUpdateBrand = () => {
  return useSWRMutation(
    BRAND_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; data: any } }) => put(`${BRAND_API_ENDPOINT}/${arg.id}`, arg.data)
  );
};

export const useDeleteBrand = () => {
  return useSWRMutation(
    BRAND_API_ENDPOINT,
    (_, { arg }: { arg: string }) => del(`${BRAND_API_ENDPOINT}/${arg}`)
  );
};

