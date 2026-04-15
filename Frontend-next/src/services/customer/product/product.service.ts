import { getServer } from "../../../@core/utils/apiServer";
import { PaginationResponse } from "../../../@core/http/models/PaginationResponse";
import { ProductListItemDto, ProductDetailDto, ProductSmallItemDto } from "../../models/product/output.dto";

export const getProducts = (params: {
  page: number;
  pageSize: number;
  [key: string]: any;
}) => {
  return getServer<PaginationResponse<ProductListItemDto>>("/products", { ...params, flatten: true });
};

export const getProductDetail = (id: string) => {
  return getServer<ProductDetailDto>(`/products/${id}`);
};

/**
 * Get related products for a product (from same category)
 */
export const getRelatedProducts = (productId: string, limit: number = 4) => {
  return getServer<ProductSmallItemDto[]>(`/products/${productId}/related`, { limit });
};

/**
 * Get brand products
 */
export const getBrandProducts = (brandId: string, excludeProductId?: string, limit: number = 4) => {
  const params: any = { limit };
  if (excludeProductId) {
    params.excludeProductId = excludeProductId;
  }
  return getServer<ProductSmallItemDto[]>(`/products/brand/${brandId}/products`, params);
};
