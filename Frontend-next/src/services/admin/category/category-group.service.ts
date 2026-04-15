import { get, post, put, del } from "../../../@core/utils/api";
import { CreateCategoryGroupDto, UpdateCategoryGroupDto } from "../../models/category-group/input.dto";
import { CategoryGroupResponseDto } from "../../models/category-group/output.dto";

export const CATEGORY_GROUP_API_ENDPOINT = "/category-groups";

export const getCategoryGroups = (page?: number, pageSize?: number, search?: string) => {
  const query = new URLSearchParams();
  if (page) query.append("page", page.toString());
  if (pageSize) query.append("pageSize", pageSize.toString());
  if (search) query.append("search", search);

  return get<CategoryGroupResponseDto[]>(`${CATEGORY_GROUP_API_ENDPOINT}?${query.toString()}`);
};

export const createCategoryGroup = (data: CreateCategoryGroupDto) => {
  return post<CategoryGroupResponseDto>(CATEGORY_GROUP_API_ENDPOINT, data);
};

export const updateCategoryGroup = (id: string, data: UpdateCategoryGroupDto) => {
  return put<CategoryGroupResponseDto>(`${CATEGORY_GROUP_API_ENDPOINT}/${id}`, data);
};

export const deleteCategoryGroup = (id: string) => {
  return del<void>(`${CATEGORY_GROUP_API_ENDPOINT}/${id}`);
};
