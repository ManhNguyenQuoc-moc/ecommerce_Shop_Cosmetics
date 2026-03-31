import { Product } from "@prisma/client";
import { ProductQueryFilters } from "./IProductRepository";
import { PagedResult } from "../common/paged-result";
import { ProductListItemDto } from "../DTO/product/output/ProductListItemDto";
export interface IProductService {
 getProducts(
  page: number,
  pageSize: number,
  flatten?: boolean,
  filters?: ProductQueryFilters
): Promise<PagedResult<ProductListItemDto>>;

  getVariants(page: number, pageSize: number, status?: string): Promise<{ variants: any[]; total: number }>;
  getProductById(id: string): Promise<any | null>;
  createProduct(data: any): Promise<Product>;
  updateProduct(id: string, data: any): Promise<any>;
  softDeleteProducts(ids: string[]): Promise<void>;
  restoreProducts(ids: string[]): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  createVariant(data: any): Promise<any>;
  updateVariant(id: string, data: any): Promise<any>;
  softDeleteVariants(ids: string[]): Promise<void>;
  restoreVariants(ids: string[]): Promise<void>;
}

