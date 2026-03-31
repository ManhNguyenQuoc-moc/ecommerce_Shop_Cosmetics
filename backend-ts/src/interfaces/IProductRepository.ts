import { Product, ProductVariant } from "@prisma/client";

export interface ProductQueryFilters {
  searchTerm?: string;
  categoryId?: string;
  status?: string;
  soldRange?: string;
  sortBy?: string;
  brandId?: string;
}

export interface IProductRepository {
  findAll(page: number, pageSize: number, filters?: ProductQueryFilters): Promise<{ products: Product[]; total: number }>;
  getVariants(page: number, pageSize: number, status?: string): Promise<{ variants: any[]; total: number }>;
  findAllUnpaginated(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: any): Promise<Product>;
  createWithTransactions(data: any): Promise<Product>;
  updateWithTransactions(id: string, data: any): Promise<Product>;
  update(id: string, data: any): Promise<Product>;
  softDeleteProducts(ids: string[]): Promise<void>;
  restoreProducts(ids: string[]): Promise<void>;
  delete(id: string): Promise<void>;
  createVariant(data: any): Promise<any>;
  updateVariant(id: string, data: any): Promise<any>;
  softDeleteVariants(ids: string[]): Promise<void>;
  restoreVariants(ids: string[]): Promise<void>;
}
