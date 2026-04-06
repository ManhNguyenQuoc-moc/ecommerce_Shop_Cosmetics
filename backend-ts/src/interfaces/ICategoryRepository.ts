import { Category, Prisma } from "@prisma/client";

export interface ICategoryRepository {
  findAll(page: number, limit: number, searchTerm?: string): Promise<{ data: Category[]; total: number }>;
  findById(id: string): Promise<Category | null>;
  create(data: Prisma.CategoryCreateInput): Promise<Category>;
  update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category>;
  delete(id: string): Promise<void>;
}
