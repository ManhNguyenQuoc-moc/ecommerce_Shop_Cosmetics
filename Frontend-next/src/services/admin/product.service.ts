import { get, post, put, del } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { ProductListResponseDto, ProductDetailDto, ProductVariantDto } from "../models/product/output.dto";
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

/* =========================
   VARIANT API
========================= */

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
  const queryParams = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
  });

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== "all") {
        queryParams.append(key, String(value));
      }
    });
  }

  const queryString = queryParams.toString();

  const fetcher = () =>
    get<ProductListResponseDto>(PRODUCT_API_ENDPOINT, {
      page,
      pageSize,
      ...filters,
    });

  const { data, error, isLoading, isValidating, mutate } = useFetchSWR<ProductListResponseDto>(
    `${PRODUCT_API_ENDPOINT}?${queryString}`,
    fetcher
  );

  return {
    products: data?.products || [],   // ✅ chuẩn
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
  status: string = "active"
) => {
  const url = `${PRODUCT_API_ENDPOINT}/variants/list?page=${page}&pageSize=${pageSize}&status=${status}`;

  const fetcher = () =>
    get<PagedResult<ProductVariantDto>>(url);

  const { data, error, isLoading, isValidating, mutate } =
    useFetchSWR<PagedResult<ProductVariantDto>>(url, fetcher);

  return {
    variants: data?.data || [],
    total: data?.total || 0,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};

export const useProduct = (id: string) => {
  const fetcher = () =>
    get<ProductDetailDto>(`${PRODUCT_API_ENDPOINT}/${id}`);

  const { data, error, isLoading, isValidating, mutate } =
    useFetchSWR<ProductDetailDto>(
      id ? `${PRODUCT_API_ENDPOINT}/${id}` : null,
      fetcher
    );

  return {
    product: data || null,
    isLoading: isLoading || isValidating,
    isError: error,
    mutate,
  };
};
