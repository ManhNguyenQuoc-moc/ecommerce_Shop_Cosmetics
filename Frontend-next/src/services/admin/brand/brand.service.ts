import { get, post, put, del } from "../../../@core/utils/api";
import { BrandResponseDto } from "../../models/brand/output.dto";
import { CreateBrandDto, UpdateBrandDto, BrandQueryFilters } from "../../models/brand/input.dto";
import { PaginationResponse } from "../../../@core/http/models/PaginationResponse";
import { buildQueryString } from "../../../@core/utils/query.util";

export const BRAND_API_ENDPOINT = "/brands";

// Pure API functions - safe for Server Components
export const getBrands = (filters?: BrandQueryFilters) => {
  const query = buildQueryString(filters || {});
  return get<PaginationResponse<BrandResponseDto>>(`${BRAND_API_ENDPOINT}${query}`);
};

export const getBrandById = (id: string) => {
  return get<BrandResponseDto>(`${BRAND_API_ENDPOINT}/${id}`);
};

export const createBrand = (data: CreateBrandDto) => {
  return post<BrandResponseDto>(BRAND_API_ENDPOINT, data);
};

export const updateBrand = (id: string, data: UpdateBrandDto) => {
  return put<BrandResponseDto>(`${BRAND_API_ENDPOINT}/${id}`, data);
};

export const deleteBrand = (id: string) => {
  return del(`${BRAND_API_ENDPOINT}/${id}`);
};
