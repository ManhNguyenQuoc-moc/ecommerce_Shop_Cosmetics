import { get, post, put, del } from "../../../@core/utils/api";
import { BrandResponseDto } from "../../models/brand/output.dto";

export const BRAND_API_ENDPOINT = "/brands";

// Pure API functions - safe for Server Components
export const getBrands = (filters?: any) => {
  return get<any>(`${BRAND_API_ENDPOINT}`, filters);
};

export const getBrandById = (id: string) => {
  return get<BrandResponseDto>(`${BRAND_API_ENDPOINT}/${id}`);
};

export const createBrand = (data: any) => {
  return post<BrandResponseDto>(BRAND_API_ENDPOINT, data);
};

export const updateBrand = (id: string, data: any) => {
  return put<BrandResponseDto>(`${BRAND_API_ENDPOINT}/${id}`, data);
};

export const deleteBrand = (id: string) => {
  return del(`${BRAND_API_ENDPOINT}/${id}`);
};
