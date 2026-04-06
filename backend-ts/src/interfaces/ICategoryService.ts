import { Category } from "@prisma/client";
import { CreateCategoryDTO } from "../DTO/category/input/CreateCategoryDTO";
import { UpdateCategoryDTO } from "../DTO/category/input/UpdateCategoryDTO";
import { PagedResult } from "../common/paged-result";

export interface ICategoryService {
  getCategories(page: number, limit: number, searchTerm?: string): Promise<PagedResult<Category>>;
  getCategoryById(id: string): Promise<Category | null>;
  createCategory(data: CreateCategoryDTO): Promise<Category>;
  updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
}
