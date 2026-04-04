import { Product, ProductVariant, Prisma } from "@prisma/client";
import { CreateProductDTO, CreateVariantDTO } from "../DTO/product/input/AddProductDTO";
import { UpdateProductDTO, UpdateVariantDTO } from "../DTO/product/input/UpdateProductDTO";

export type ProductVariantWithRelations = Prisma.ProductVariantGetPayload<{
  include: {
    product: {
      include: { brand: true, category: true, productImages: { include: { image: true } } }
    },
    image: true,
    orderItems: true
  }
}>;

export interface ProductQueryFilters {
  searchTerm?: string;
  categoryId?: string;
  status?: string;
  soldRange?: string;
  sortBy?: string;
  brandId?: string;
}

export interface VariantQueryFilters {
  searchTerm?: string;
  status?: string;
  sortBy?: string;
  classification?: string;
  priceRange?: string;
  statusName?: string;
  productId?: string;
  brandId?: string;
}

export interface IProductRepository {
  findAll(page: number, pageSize: number, filters?: ProductQueryFilters): Promise<{ products: Product[]; total: number }>;
  getVariants(page: number, pageSize: number, filters?: VariantQueryFilters): Promise<{ variants: ProductVariantWithRelations[]; total: number }>;
  findAllUnpaginated(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: Prisma.ProductCreateInput): Promise<Product>;
  createWithTransactions(data: CreateProductDTO & { imageIds: string[] }): Promise<Product>;
  updateWithTransactions(id: string, data: UpdateProductDTO & { newImageIds: string[] }): Promise<Product>;
  update(id: string, data: Prisma.ProductUpdateInput): Promise<Product>;
  softDeleteProducts(ids: string[]): Promise<void>;
  restoreProducts(ids: string[]): Promise<void>;
  delete(id: string): Promise<void>;
  createVariant(data: CreateVariantDTO & { productId: string }): Promise<ProductVariant>;
  updateVariant(id: string, data: UpdateVariantDTO): Promise<ProductVariant>;
  softDeleteVariants(ids: string[]): Promise<void>;
  restoreVariants(ids: string[]): Promise<void>;
}
