import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { mutate as globalMutate } from "swr";
import { ProductListResponseDto, ProductListItemDto, ProductDetailDto, ProductVariantDto, VariantListResponseDto, VariantDetailDto } from "@/src/services/models/product/output.dto";
import { PaginationResponse } from "@/src/@core/http/models/PaginationResponse";
import { ProductQueryParams } from "@/src/services/models/product/input.dto";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { get } from "@/src/@core/utils/api";

const PRODUCT_API_ENDPOINT = "/products";

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

export const useProducts = (
  page: number,
  pageSize: number,
  filters?: ProductQueryParams
) => {
  const query = buildQueryString({ page, pageSize, ...filters });

  const fetcher = () => get<PaginationResponse<ProductListItemDto>>(`${PRODUCT_API_ENDPOINT}${query}`);

  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<PaginationResponse<ProductListItemDto>>(
    `${PRODUCT_API_ENDPOINT}${query}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
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
