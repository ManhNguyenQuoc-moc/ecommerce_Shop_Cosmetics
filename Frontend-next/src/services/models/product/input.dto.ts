export interface ProductSpecificationInput {
  label: string;
  value: string;
}

export interface CreateVariantInput {
  sku?: string;
  color?: string;
  size?: string;
  price: number;
  salePrice?: number;
  costPrice?: number;
  imageUrl?: string | null;
  statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW' | 'SALE';
}

export interface UpdateVariantInput {
  id?: string;
  sku?: string;
  color?: string;
  size?: string;
  price: number;
  salePrice?: number | null;
  costPrice?: number | null;
  imageUrl?: string | null;
  imageId?: string | null;
  statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW' | 'SALE';
}

export interface CreateProductInput {
  name: string;
  brandId: string;
  categoryId: string;
  short_description?: string;
  long_description?: string;
  status?: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
  images: string[]; // gallery URLs
  specifications?: ProductSpecificationInput[];
  variants: CreateVariantInput[];
}

export interface UpdateProductInput {
  name: string;
  brandId?: string;
  categoryId?: string;
  short_description?: string;
  long_description?: string;
  status?: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
  newImages?: string[];
  imageIdsToRemove?: string[];
  specifications?: ProductSpecificationInput[];
  variants?: UpdateVariantInput[];
}

export interface BulkIdsInput {
  ids: string[];
}

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  searchTerm?: string;
  categoryId?: string;
  status?: string;
  soldRange?: string;
  sortBy?: string;
  brandId?: string;
  flatten?: boolean;
  classification?: string;
  priceRange?: string;
  statusName?: string;
  productId?: string;
  minimal?: boolean;
}