import { Category } from "@prisma/client";

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  create(data: any): Promise<Category>;
  update(id: string, data: any): Promise<Category>;
  delete(id: string): Promise<void>;
}
