import { Product } from "@prisma/client";
import { ProductQueryFilters, VariantQueryFilters } from "./IProductRepository";
import { PagedResult } from "../common/paged-result";
import { ProductListItemDto } from "../DTO/product/output/ProductListItemDto";
import { CreateProductDTO, CreateVariantDTO } from "../DTO/product/input/AddProductDTO";
import { UpdateProductDTO, UpdateVariantDTO } from "../DTO/product/input/UpdateProductDTO";
import { VariantListItemDto } from "../DTO/product/output/VariantListItemDto";
import { VariantDetailDto, VariantBatchDto } from "../DTO/product/output/VariantDetailDto";

export interface IProductService {
 getProducts(
  page: number,
  pageSize: number,
  flatten?: boolean,
  filters?: ProductQueryFilters
 ): Promise<PagedResult<ProductListItemDto>>;

  getVariants(page: number, pageSize: number, filters?: VariantQueryFilters): Promise<PagedResult<VariantListItemDto>>;
  getProductById(id: string): Promise<any | null>; // Leaving as any for now or using a more specific one if available
  getVariantById(id: string): Promise<VariantDetailDto | null>;
  getVariantBatches(variantId: string, page: number, pageSize: number): Promise<PagedResult<VariantBatchDto>>;
  createProduct(data: CreateProductDTO): Promise<Product>;
  updateProduct(id: string, data: UpdateProductDTO): Promise<any>;
  softDeleteProducts(ids: string[]): Promise<void>;
  restoreProducts(ids: string[]): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  createVariant(data: CreateVariantDTO): Promise<any>;
  updateVariant(id: string, data: UpdateVariantDTO): Promise<any>;
  softDeleteVariants(ids: string[]): Promise<void>;
  restoreVariants(ids: string[]): Promise<void>;

  // Related & Brand Products
  getRelatedProducts(productId: string, limit: number): Promise<any[]>;
  getBrandProducts(brandId: string, excludeProductId: string | null, limit: number): Promise<any[]>;
}

