import { get } from "../../../@core/utils/api";
import { BrandResponseDto } from "../../models/brand/output.dto";

export const BRAND_API_ENDPOINT = "/brands";

// Pure API functions - safe for Server Components
export const getCustomerBrands = (page: number = 1, pageSize: number = 10, searchTerm?: string, category?: string) => {
  const query = new URLSearchParams();
  query.append("page", page.toString());
  query.append("pageSize", pageSize.toString());
  if (searchTerm) query.append("searchTerm", searchTerm);
  if (category) query.append("category", category);

  const url = `${BRAND_API_ENDPOINT}?${query.toString()}`;
  return get(url);
};

export const getBrandById = (id: string) => {
  return get<BrandResponseDto>(`${BRAND_API_ENDPOINT}/${id}`);
};
