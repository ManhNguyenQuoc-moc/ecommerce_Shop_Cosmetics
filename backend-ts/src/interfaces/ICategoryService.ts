import { Category } from "@prisma/client";

export interface ICategoryService {
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | null>;
  createCategory(data: any): Promise<Category>;
  updateCategory(id: string, data: any): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
}
