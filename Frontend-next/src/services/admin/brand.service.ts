import { get, post, put, del } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";
import { PaginationResponse } from "../models/common/PaginationResponse";
import { buildQueryString } from "../../utils/query.util";
import { BrandResponseDto } from "../models/brand/output.dto";

export const BRAND_API_ENDPOINT = "/brands";

export const useBrands = (page: number | null = null, pageSize: number | null = null, filters: any = {}) => {
  const queryString = buildQueryString({
    page,
    pageSize,
    ...filters
  });

  const { data, isLoading, error, mutate } = useFetchSWR<PaginationResponse<BrandResponseDto>>(
    `${BRAND_API_ENDPOINT}${queryString}`,
    () => get(`${BRAND_API_ENDPOINT}${queryString}`)
  );

  return {
    brands: data?.data || [],
    total: data?.total || 0,
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
