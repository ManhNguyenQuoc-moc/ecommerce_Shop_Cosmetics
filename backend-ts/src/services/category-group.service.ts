// Workaround for Prisma type export issues
type CategoryGroup = any;
import { ICategoryGroupRepository } from "../interfaces/ICategoryGroupRepository";
import { ICategoryGroupService } from "../interfaces/ICategoryGroupService";
import { CreateCategoryGroupDTO } from "../DTO/category-group/input/CreateCategoryGroupDTO";
import { UpdateCategoryGroupDTO } from "../DTO/category-group/input/UpdateCategoryGroupDTO";
import { PagedResult } from "../common/paged-result";
import { generateSlug } from "../utils/slugify";

export class CategoryGroupService implements ICategoryGroupService {
  private readonly repository: ICategoryGroupRepository;

  constructor(repository: ICategoryGroupRepository) {
    this.repository = repository;
  }

  async getCategoryGroups(page: number, limit: number, searchTerm?: string): Promise<PagedResult<CategoryGroup>> {
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, limit);
    
    const { data, total } = await this.repository.findAll(validPage, validLimit, searchTerm);
    
    return {
      data,
      total,
      page: validPage,
      pageSize: validLimit
    };
  }

  async getCategoryGroupById(id: string): Promise<CategoryGroup | null> {
    return this.repository.findById(id);
  }

  async createCategoryGroup(data: CreateCategoryGroupDTO): Promise<CategoryGroup> {
    const slug = generateSlug(data.name);
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const createData: any = {
      ...data,
      slug,
    };
    
    return this.repository.create(createData);
  }

  async updateCategoryGroup(id: string, data: UpdateCategoryGroupDTO): Promise<CategoryGroup> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = { ...data };
    
    if (data.name) {
      updateData.slug = generateSlug(data.name);
    }
    
    return this.repository.update(id, updateData);
  }

  async deleteCategoryGroup(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
