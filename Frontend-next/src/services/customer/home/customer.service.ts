import { getServer } from "../../../@core/utils/apiServer";
import { CategoryResponseDto } from "../../models/category/output.dto";
import { BrandResponseDto } from "../../models/brand/output.dto";

export type { BrandResponseDto };
export const getServerCategories = async (): Promise<CategoryResponseDto[]> => {
  const res = await getServer<CategoryResponseDto[] | { data: CategoryResponseDto[] }>("/categories", undefined, {
    revalidate: 60
  });

  return (res as any)?.data || (Array.isArray(res) ? res : []);
};

export const getServerBrands = async (page: number = 1, pageSize: number = 1000): Promise<BrandResponseDto[]> => {
  const res = await getServer<any>("/brands", { page, pageSize }, {
    revalidate: 60
  });

  return res?.data?.data || res?.data || [];
};
