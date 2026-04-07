import { SWRConfiguration } from "swr";
import { get } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { CategoryResponseDto } from "../models/category/output.dto";

export const CUSTOMER_CATEGORY_API_ENDPOINT = "/categories";

export const useCustomerCategories = (options?: SWRConfiguration) => {
  const { data, isLoading, error, mutate } = useFetchSWR(
    CUSTOMER_CATEGORY_API_ENDPOINT,
    () => get(CUSTOMER_CATEGORY_API_ENDPOINT),
    options
  );

  const categories = (data as any)?.data || (Array.isArray(data) ? data : []);

  return {
    categories: categories as CategoryResponseDto[],
    isLoading,
    isError: error,
    mutate
  };
};
