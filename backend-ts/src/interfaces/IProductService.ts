import { Product } from "@prisma/client";
import { ProductQueryFilters, VariantQueryFilters } from "./IProductRepository";
import { PagedResult } from "../common/paged-result";
import { ProductListItemDto } from "../DTO/product/output/ProductListItemDto";
import { CreateProductDTO, CreateVariantDTO } from "../DTO/product/input/AddProductDTO";
import { UpdateProductDTO, UpdateVariantDTO } from "../DTO/product/input/UpdateProductDTO";
export interface IProductService {
 getProducts(
  page: number,
  pageSize: number,
  flatten?: boolean,
  filters?: ProductQueryFilters
): Promise<PagedResult<ProductListItemDto>>;

  getVariants(page: number, pageSize: number, filters?: VariantQueryFilters): Promise<PagedResult<any>>;
  getProductById(id: string): Promise<any | null>;
  getVariantById(id: string): Promise<any | null>;
  getVariantBatches(variantId: string, page: number, pageSize: number): Promise<PagedResult<any>>;
  createProduct(data: CreateProductDTO): Promise<Product>;
  updateProduct(id: string, data: UpdateProductDTO): Promise<any>;
  softDeleteProducts(ids: string[]): Promise<void>;
  restoreProducts(ids: string[]): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  createVariant(data: CreateVariantDTO): Promise<any>;
  updateVariant(id: string, data: UpdateVariantDTO): Promise<any>;
  softDeleteVariants(ids: string[]): Promise<void>;
  restoreVariants(ids: string[]): Promise<void>;
}

