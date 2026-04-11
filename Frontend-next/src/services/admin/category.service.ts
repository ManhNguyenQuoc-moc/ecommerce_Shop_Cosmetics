import { get, post, put, del } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryFilters } from "../models/category/input.dto";
import { CategoryResponseDto } from "../models/category/output.dto";
import { buildQueryString } from "../../utils/query.util";
import { PaginationResponse } from "../models/common/PaginationResponse";

export const CATEGORY_API_ENDPOINT = "/categories";

export const useCategories = (page: number | null = null, pageSize: number | null = null, filters: CategoryQueryFilters = {}) => {
  const query = buildQueryString({ page, pageSize, ...filters });
  const url = `${CATEGORY_API_ENDPOINT}${query}`;

  const { data, isLoading, error, mutate } = useFetchSWR<PaginationResponse<CategoryResponseDto>>(
    url,
    () => get(url)
  );

  return {
    categories: data?.data || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate
  };
};

export const useCreateCategory = () => {
  return useSWRMutation(CATEGORY_API_ENDPOINT, (_, { arg }: { arg: CreateCategoryDto }) => post(CATEGORY_API_ENDPOINT, arg));
};

export const useUpdateCategory = () => {
  return useSWRMutation(
    CATEGORY_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; data: UpdateCategoryDto } }) => put(`${CATEGORY_API_ENDPOINT}/${arg.id}`, arg.data)
  );
};

export const useDeleteCategory = () => {
  return useSWRMutation(
    CATEGORY_API_ENDPOINT,
    (_, { arg }: { arg: string }) => del(`${CATEGORY_API_ENDPOINT}/${arg}`)
  );
};
