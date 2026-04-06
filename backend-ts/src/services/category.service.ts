import { Category } from "@prisma/client";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { ICategoryService } from "../interfaces/ICategoryService";
import { CreateCategoryDTO } from "../DTO/category/input/CreateCategoryDTO";
import { UpdateCategoryDTO } from "../DTO/category/input/UpdateCategoryDTO";
import { PagedResult } from "../common/paged-result";
import { generateSlug } from "../utils/slugify";

export class CategoryService implements ICategoryService {
  private readonly categoryRepository: ICategoryRepository;

  constructor(categoryRepository: ICategoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async getCategories(page: number, limit: number, searchTerm?: string): Promise<PagedResult<Category>> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, limit);
    
    const { data, total } = await this.categoryRepository.findAll(validPage, validLimit, searchTerm);
    
    return {
      data,
      total,
      page: validPage,
      pageSize: validLimit
    };
  }

  async getCategoryById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async createCategory(data: CreateCategoryDTO): Promise<Category> {
    const slug = generateSlug(data.name);
    
    const createData: any = {
      ...data,
      slug,
    };
    
    if (data.image?.url) {
      createData.image = { create: { url: data.image.url } };
    } else {
       delete createData.image;
    }
    
    return this.categoryRepository.create(createData);
  }

  async updateCategory(id: string, data: UpdateCategoryDTO): Promise<Category> {
    const updateData: any = { ...data };
    
    // Nếu có đổi tên mới thì gen lại slug
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }
    
    if (data.image?.url) {
      updateData.image = { create: { url: data.image.url } };
    } else if (data.image === null) {
      updateData.image = { disconnect: true };
    } else {
      delete updateData.image;
    }
    
    return this.categoryRepository.update(id, updateData);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.categoryRepository.delete(id);
  }
}
