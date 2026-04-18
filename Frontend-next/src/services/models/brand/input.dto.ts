export interface CreateBrandDto {
  name: string;
  description?: string;
  logo?: File;
  banner?: File;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
  logo?: File;
  banner?: File;
}

export interface BrandQueryFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  minimal?: boolean;
}
