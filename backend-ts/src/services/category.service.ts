import { Category } from "@prisma/client";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { ICategoryService } from "../interfaces/ICategoryService";

export class CategoryService implements ICategoryService {
  private readonly categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async createCategory(data: any): Promise<Category> {
    return this.categoryRepository.create(data);
  }

  async updateCategory(id: string, data: any): Promise<Category> {
    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.categoryRepository.delete(id);
  }
}
