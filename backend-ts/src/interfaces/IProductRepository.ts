import { Product, ProductVariant } from "@prisma/client";

export interface IProductRepository {
  findAll(page: number, limit: number, brandId?: string): Promise<{ products: Product[]; total: number }>;
  getVariants(page: number, limit: number): Promise<{ variants: any[]; total: number }>;
  findAllUnpaginated(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: any): Promise<Product>;
  createWithTransactions(data: any): Promise<Product>;
  update(id: string, data: any): Promise<Product>;
  delete(id: string): Promise<void>;
  createVariant(data: any): Promise<any>;
  updateVariant(id: string, data: any): Promise<any>;
}
