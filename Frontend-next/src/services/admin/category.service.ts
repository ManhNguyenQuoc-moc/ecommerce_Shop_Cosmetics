import { get, post, put, del } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryFilters } from "../models/category/input.dto";
import { CategoryResponseDto } from "../models/category/output.dto";

export const CATEGORY_API_ENDPOINT = "/categories";

export const useCategories = (page: number | null = null, pageSize: number | null = null, filters: CategoryQueryFilters = {}) => {
  const query = new URLSearchParams();
  if (page) query.append("page", page.toString());
  if (pageSize) query.append("pageSize", pageSize.toString());
  
  if (filters.search) query.append("search", filters.search);

  const url = `${CATEGORY_API_ENDPOINT}?${query.toString()}`;

  const { data, isLoading, error, mutate } = useFetchSWR(
    url,
    () => get(url)
  );

  const responseData = data as any;
  const categories = Array.isArray(responseData) 
    ? responseData 
    : (responseData?.data?.data || responseData?.data || []);
  const total = Array.isArray(responseData) 
    ? responseData.length 
    : (responseData?.data?.total || responseData?.total || 0);

  return {
    categories: categories as CategoryResponseDto[],
    total,
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
