import { get } from "../api";
import useSWR from "swr";

export const CATEGORY_API_ENDPOINT = "/categories";

export const getCategories = () => {
  return get(CATEGORY_API_ENDPOINT);
};

export const useCategories = () => {
  const { data, error, isLoading } = useSWR(CATEGORY_API_ENDPOINT, getCategories);
  return {
    categories: (data as any) || [],
    isLoading,
    isError: error,
  };
};
