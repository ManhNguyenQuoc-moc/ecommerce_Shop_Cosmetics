import { get, post, put, del } from "../api";
import useSWR from "swr";

export const PRODUCT_API_ENDPOINT = "/products";

export const getProducts = (params?: any) => {
  return get(PRODUCT_API_ENDPOINT, params);
};

export const createProduct = (data: any) => {
  return post(PRODUCT_API_ENDPOINT, data);
};

export const updateProduct = (id: string, data: any) => {
  return put(`${PRODUCT_API_ENDPOINT}/${id}`, data);
};

export const deleteProduct = (id: string) => {
  return del(`${PRODUCT_API_ENDPOINT}/${id}`);
};

export const useProducts = (page: number, limit: number) => {
  // SWR will automatically dedupe and cache this request
  const fetcher = () => getProducts({ page, limit });
  const { data, error, isLoading, mutate } = useSWR(
    `${PRODUCT_API_ENDPOINT}?page=${page}&limit=${limit}`,
    fetcher
  );

  return {
    // The backend returns { data: { products: [...], total: ... } } because api.ts extracts `res.data.data`
    // Assuming api.ts -> res.data.data resolves to { products, total, page, pageSize }
    products: (data as any)?.products || [],
    total: (data as any)?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
};
