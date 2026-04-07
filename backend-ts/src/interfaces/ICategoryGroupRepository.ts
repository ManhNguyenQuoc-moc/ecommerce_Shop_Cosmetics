import { CategoryGroup } from "@prisma/client";

export interface ICategoryGroupRepository {
  findAll(page: number, limit: number, searchTerm?: string): Promise<{ data: CategoryGroup[]; total: number }>;
  findById(id: string): Promise<CategoryGroup | null>;
  create(data: any): Promise<CategoryGroup>;
  update(id: string, data: any): Promise<CategoryGroup>;
  delete(id: string): Promise<void>;
}
