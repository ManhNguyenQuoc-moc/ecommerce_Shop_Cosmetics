import { Product, ProductVariant } from "@prisma/client";

export interface IProductRepository {
  findAll(page: number, limit: number): Promise<{ products: Product[]; total: number }>;
  findAllUnpaginated(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  create(data: any): Promise<Product>;
  createWithTransactions(data: any): Promise<Product>;
  update(id: string, data: any): Promise<Product>;
  delete(id: string): Promise<void>;
}
