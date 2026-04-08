import { getServer } from "../apiServer";
import { CategoryResponseDto } from "../models/category/output.dto";

export interface BrandResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logo: { id: string; url: string } | null;
  banner: { id: string; url: string } | null;
  createdAt: string;
  updatedAt: string;
}
export const getServerCategories = async (): Promise<CategoryResponseDto[]> => {
  const res = await getServer<CategoryResponseDto[] | { data: CategoryResponseDto[] }>("/categories", undefined, {
    revalidate: 60
  });

  return (res as any)?.data || (Array.isArray(res) ? res : []);
};

export const getServerBrands = async (page: number = 1, pageSize: number = 100): Promise<BrandResponseDto[]> => {
  const res = await getServer<{ data: BrandResponseDto[]; total: number }>("/brands", { page, pageSize }, {
    revalidate: 60
  });

  return (res as any)?.data || [];
};
