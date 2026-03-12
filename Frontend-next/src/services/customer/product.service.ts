import { get } from "../api";
import { ProductPagination } from "@/src/@core/type/Product";

type Params = {
  page: number;
  pageSize: number;
  category?: string;
};

export const getProducts = (params: Params) =>
  get<ProductPagination>("/products", params);