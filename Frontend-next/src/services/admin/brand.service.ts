import { get } from "../api";
import useSWR from "swr";

export const BRAND_API_ENDPOINT = "/brands";

export const getBrands = () => {
  return get(BRAND_API_ENDPOINT);
};

export const useBrands = () => {
  const { data, error, isLoading } = useSWR(BRAND_API_ENDPOINT, getBrands);
  return {
    brands: (data as any) || [],
    isLoading,
    isError: error,
  };
};
