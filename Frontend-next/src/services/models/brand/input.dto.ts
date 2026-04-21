export interface CreateBrandDto {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: { url: string };
  banner?: { url: string };
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  logo?: { url: string };
  banner?: { url: string };
}

export interface BrandQueryFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: "newest" | "oldest" | "name_asc" | "name_desc";
  mediaStatus?: "all" | "with_logo" | "without_logo" | "with_banner" | "without_banner";
  minimal?: boolean;
}
