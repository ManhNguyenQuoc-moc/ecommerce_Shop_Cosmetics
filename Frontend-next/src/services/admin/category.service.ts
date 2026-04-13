import { get, post, put, del } from "../api";
import { CreateCategoryDto, UpdateCategoryDto, CategoryQueryFilters } from "../models/category/input.dto";
import { CategoryResponseDto } from "../models/category/output.dto";
import { buildQueryString } from "../../@core/utils/query.util";
import { PaginationResponse } from "../models/common/PaginationResponse";

export const CATEGORY_API_ENDPOINT = "/categories";

// Pure API functions - safe for Server Components
export const getCategories = (page: number | null = null, pageSize: number | null = null, filters: CategoryQueryFilters = {}) => {
  const query = buildQueryString({ page, pageSize, ...filters });
  const url = `${CATEGORY_API_ENDPOINT}${query}`;
  return get<PaginationResponse<CategoryResponseDto>>(url);
};

export const getCategoryById = (id: string) => {
  return get<CategoryResponseDto>(`${CATEGORY_API_ENDPOINT}/${id}`);
};

export const createCategory = (data: CreateCategoryDto) => {
  return post<CategoryResponseDto>(CATEGORY_API_ENDPOINT, data);
};

export const updateCategory = (id: string, data: UpdateCategoryDto) => {
  return put<CategoryResponseDto>(`${CATEGORY_API_ENDPOINT}/${id}`, data);
};

export const deleteCategory = (id: string) => {
  return del(`${CATEGORY_API_ENDPOINT}/${id}`);
};
