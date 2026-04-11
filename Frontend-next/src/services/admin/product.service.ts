import { get, post, put, del } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { mutate as globalMutate } from "swr";
import { ProductListResponseDto, ProductDetailDto, ProductVariantDto, VariantListResponseDto, VariantDetailDto } from "../models/product/output.dto";
import { PaginationResponse } from "../models/common/PaginationResponse";
import { buildQueryString } from "../../utils/query.util";

/**
 * Call this after any stock receipt to revalidate all related SWR caches:
 * - All variant lists
 * - All variant details  
 * - All batch lists
 * - All inventory batches
 * - All products
 */
export const revalidateAllInventory = () => {
  // Revalidate all keys that start with product/variant/inventory endpoints
  globalMutate(
    (key: string) =>
      typeof key === "string" &&
      (key.startsWith("/products") ||
        key.startsWith("/inventory")),
    undefined,
    { revalidate: true }
  );
};
export const useVariant = (id: string | undefined) => {
  const fetcher = () =>
    id ? get<VariantDetailDto>(`${PRODUCT_API_ENDPOINT}/variants/${id}`) : Promise.reject("No ID provided");

  const { data, error, isLoading, isValidating, mutate } =
    useFetchSWR<VariantDetailDto>(
      id ? `${PRODUCT_API_ENDPOINT}/variants/${id}` : null,
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: true,
      }
    );

  return {
    variant: data || null,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const useVariantBatches = (
  variantId: string | undefined,
  page: number,
  pageSize: number
) => {
  const fetcher = () =>
    variantId
      ? get<PaginationResponse<any>>(
        `${PRODUCT_API_ENDPOINT}/variants/${variantId}/batches`,
        { page, pageSize }
      )
      : Promise.reject("No ID provided");

  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PaginationResponse<any>>(
    variantId
      ? `${PRODUCT_API_ENDPOINT}/variants/${variantId}/batches?page=${page}&pageSize=${pageSize}`
      : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      revalidateIfStale: true,
    }
  );

  return {
    batches: data?.data || [],
    total: data?.total || 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};
import { CreateProductInput, ProductQueryParams, UpdateProductInput, CreateVariantInput, UpdateVariantInput } from "../models/product/input.dto";
export const PRODUCT_API_ENDPOINT = "/products";

export const createProduct = (data: CreateProductInput) => {
  return post<ProductDetailDto>(PRODUCT_API_ENDPOINT, data);
};

export const updateProduct = (id: string, data: UpdateProductInput) => {
  return put<ProductDetailDto>(`${PRODUCT_API_ENDPOINT}/${id}`, data);
};

export const deleteProduct = (id: string) => {
  return del<void>(`${PRODUCT_API_ENDPOINT}/${id}`);
};

export const softDeleteProducts = (ids: string[]) => {
  return post<void>(`${PRODUCT_API_ENDPOINT}/bulk-delete`, { ids });
};

export const restoreProducts = (ids: string[]) => {
  return post<void>(`${PRODUCT_API_ENDPOINT}/bulk-restore`, { ids });
};

export const createVariant = (data: CreateVariantInput) => {
  return post<ProductVariantDto>(`${PRODUCT_API_ENDPOINT}/variants`, data);
};

export const updateVariant = (id: string, data: UpdateVariantInput) => {
  return put<ProductVariantDto>(`${PRODUCT_API_ENDPOINT}/variants/${id}`, data);
};

export const deleteVariant = (id: string) => {
  return del<void>(`${PRODUCT_API_ENDPOINT}/variants/${id}`);
};

export const softDeleteVariants = (ids: string[]) => {
  return post<void>(`${PRODUCT_API_ENDPOINT}/variants/bulk-delete`, { ids });
};

export const restoreVariants = (ids: string[]) => {
  return post<void>(`${PRODUCT_API_ENDPOINT}/variants/bulk-restore`, { ids });
};


export const useProducts = (
  page: number,
  pageSize: number,
  filters?: ProductQueryParams
) => {
  const query = buildQueryString({ page, pageSize, ...filters });

  const fetcher = () => get<PaginationResponse<any>>(`${PRODUCT_API_ENDPOINT}${query}`);

  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PaginationResponse<any>>(
    `${PRODUCT_API_ENDPOINT}${query}`,
    fetcher
  );

  return {
    products: data?.data || [],
    total: data?.total || 0,
    page: data?.page || page,
    pageSize: data?.pageSize || pageSize,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const useVariants = (
  page: number,
  pageSize: number,
  filters?: ProductQueryParams
) => {
  const query = buildQueryString({ page, pageSize, ...filters });

  const fetcher = () =>
    get<PaginationResponse<ProductVariantDto>>(`${PRODUCT_API_ENDPOINT}/variants/list${query}`);

  const { data, error, isLoading, isValidating, mutate } =
    useFetchSWR<PaginationResponse<ProductVariantDto>>(
      `${PRODUCT_API_ENDPOINT}/variants/list${query}`,
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: true,
      }
    );
  return {
    variants: data?.data || [],
    total: data?.total || 0,
    page: data?.page || page,
    pageSize: data?.pageSize || pageSize,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const useProduct = (id: string | undefined) => {
  const fetcher = () =>
    id ? get<ProductDetailDto>(`${PRODUCT_API_ENDPOINT}/${id}`) : Promise.reject("No ID provided");

  const { data, error, isLoading, isValidating, mutate } =
    useFetchSWR<ProductDetailDto>(
      id ? `${PRODUCT_API_ENDPOINT}/${id}` : null,
      fetcher,
      {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: true,
      }
    );

  return {
    product: data || null,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};
