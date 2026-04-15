import { get, post, put, del } from "../../../@core/utils/api";
import { mutate as globalMutate } from "swr";
import { ProductDetailDto, ProductVariantDto } from "../../models/product/output.dto";
import { CreateProductInput, ProductQueryParams, UpdateProductInput, CreateVariantInput, UpdateVariantInput } from "../../models/product/input.dto";

export const PRODUCT_API_ENDPOINT = "/products";

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
