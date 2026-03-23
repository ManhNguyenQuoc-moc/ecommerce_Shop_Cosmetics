
import { getServer } from "../apiServer";
import { ProductPagination, ProductDetail} from "@/src/@core/type/Product";



export const getProducts = (params: {
  page: number;
  pageSize: number;
  [key: string]: any;
}) => {
  return getServer<ProductPagination>("/products", { ...params, flatten: true });
};

export const getProductDetail = (id: string) => {
  return getServer<ProductDetail>(`/products/${id}`);
};