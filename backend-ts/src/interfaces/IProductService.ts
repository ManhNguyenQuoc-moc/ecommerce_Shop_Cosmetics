import { Product } from "@prisma/client";

export interface IProductService {
  getProducts(page: number, limit: number, flatten?: boolean, brandId?: string): Promise<{ products: any[]; total: number }>;
  getVariants(page: number, limit: number): Promise<{ variants: any[]; total: number }>;
  getProductById(id: string): Promise<any | null>;
  createProduct(data: any): Promise<Product>;
  updateProduct(id: string, data: any): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  createVariant(data: any): Promise<any>;
  updateVariant(id: string, data: any): Promise<any>;
}
