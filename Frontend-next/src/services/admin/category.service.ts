import { get } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";

export const CATEGORY_API_ENDPOINT = "/categories";

export const getCategories = () => {
  return get(CATEGORY_API_ENDPOINT);
};

export const useCategories = () => {
  const { data, error, isLoading } = useFetchSWR(CATEGORY_API_ENDPOINT, getCategories);
  
  // Handle both raw array (old) and paginated object (new)
  const categories = Array.isArray(data) ? data : (data as any)?.data || [];

  return {
    categories,
    isLoading,
    isError: error,
  };
};
