import { get, post, put, del } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";

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

export const useProducts = (page: number, limit: number, brandId?: string) => {
  // SWR will automatically dedupe and cache this request
  const fetcher = () => getProducts({ page, limit, brandId });
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR(
    `${PRODUCT_API_ENDPOINT}?page=${page}&limit=${limit}${brandId ? `&brandId=${brandId}` : ""}`,
    fetcher
  );

  return {
    // The backend returns { data: { products: [...], total: ... } } because api.ts extracts `res.data.data`
    // Assuming api.ts -> res.data.data resolves to { products, total, page, pageSize }
    products: (data as any)?.products || (data as any)?.data?.products || [],
    total: (data as any)?.total || (data as any)?.data?.total || 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const useVariants = (page: number, limit: number) => {
  const fetcher = () => get(`${PRODUCT_API_ENDPOINT}/variants/list?page=${page}&limit=${limit}`);
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR(
    `${PRODUCT_API_ENDPOINT}/variants/list?page=${page}&limit=${limit}`,
    fetcher
  );

  return {
    variants: (data as any)?.variants || (data as any)?.data?.variants || [],
    total: (data as any)?.total || (data as any)?.data?.total || 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const createVariant = (data: any) => {
  return post(`${PRODUCT_API_ENDPOINT}/variants`, data);
};

export const updateVariant = (id: string, data: any) => {
  return put(`${PRODUCT_API_ENDPOINT}/variants/${id}`, data);
};

export const deleteVariant = (id: string) => {
  return del(`${PRODUCT_API_ENDPOINT}/variants/${id}`);
};

export const useProduct = (id: string) => {
  const fetcher = () => get(`${PRODUCT_API_ENDPOINT}/${id}`);
  const { data, error, isLoading, isValidating, mutate } = useFetchSWR(
    id ? `${PRODUCT_API_ENDPOINT}/${id}` : null,
    fetcher
  );

  return {
    product: (data as any)?.data || (data as any) || null,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};
