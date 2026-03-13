// import { get } from "../api";
import { getServer } from "../apiServer";
import { ProductPagination, ProductDetail} from "@/src/@core/type/Product";



export const getProducts = (params: {
  page: number;
  pageSize: number;
}) => {
  return getServer<ProductPagination>("/products", params);
};

export const getProductDetail = (id: string) => {
  return getServer<ProductDetail>(`/products/${id}`);
};