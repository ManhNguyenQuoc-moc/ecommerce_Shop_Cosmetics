import { CategoryGroup } from "@prisma/client";
import { CreateCategoryGroupDTO } from "../DTO/category-group/input/CreateCategoryGroupDTO";
import { UpdateCategoryGroupDTO } from "../DTO/category-group/input/UpdateCategoryGroupDTO";
import { PagedResult } from "../common/paged-result";

export interface ICategoryGroupService {
  getCategoryGroups(page: number, limit: number, searchTerm?: string): Promise<PagedResult<CategoryGroup>>;
  getCategoryGroupById(id: string): Promise<CategoryGroup | null>;
  createCategoryGroup(data: CreateCategoryGroupDTO): Promise<CategoryGroup>;
  updateCategoryGroup(id: string, data: UpdateCategoryGroupDTO): Promise<CategoryGroup>;
  deleteCategoryGroup(id: string): Promise<void>;
}
