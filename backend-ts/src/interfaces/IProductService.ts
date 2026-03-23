import { Product } from "@prisma/client";

export interface IProductService {
  getProducts(page: number, limit: number, flatten?: boolean): Promise<{ products: any[]; total: number }>;
  getProductById(id: string): Promise<any | null>;
  createProduct(data: any): Promise<Product>;
  updateProduct(id: string, data: any): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
}
