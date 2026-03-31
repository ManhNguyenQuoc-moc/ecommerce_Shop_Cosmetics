import { get, post, put, del } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";

export const BRAND_API_ENDPOINT = "/brands";

export const useBrands = (shouldFetch: boolean = true) => {
  const { data, isLoading, error, mutate } = useFetchSWR(
    shouldFetch ? BRAND_API_ENDPOINT : null,
    () => get(BRAND_API_ENDPOINT)
  );
  return {
    brands: (data as any) || [],
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

