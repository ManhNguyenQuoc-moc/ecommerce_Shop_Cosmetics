import { getServer } from "../apiServer";
import { PaginationResponse } from "../../@core/http/models/PaginationResponse";
import { ProductListItemDto, ProductDetailDto } from "../models/product/output.dto";

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