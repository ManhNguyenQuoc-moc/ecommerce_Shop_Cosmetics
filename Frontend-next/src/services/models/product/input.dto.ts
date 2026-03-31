export interface ProductSpecificationInput {
  label: string;
  value: string;
}

export interface CreateVariantInput {
  color?: string;
  size?: string;
  price: number;
  salePrice?: number;
  imageUrl?: string;
}

export interface UpdateVariantInput {
  id?: string;
  color?: string;
  size?: string;
  price?: number;
  salePrice?: number;
  imageUrl?: string | null;
  imageId?: string | null;
}

export interface CreateProductInput {
  name: string;
  brandId: string;
  categoryId: string;
  short_description?: string;
  long_description?: string;
  images: string[];
  specifications?: ProductSpecificationInput[];
  variants: CreateVariantInput[];
}

export interface UpdateProductInput {
  name?: string;
  brandId?: string;
  categoryId?: string;

  short_description?: string;
  long_description?: string;

  images?: string[];

  imageIdsToRemove?: string[];

  variants?: UpdateVariantInput[];
}

export interface BulkIdsInput {
  ids: string[];
}
export interface ProductQueryParams {
  page?: number;
  pageSize?: number;

  search?: string;        // req.query.search
  categoryId?: string;    // req.query.categoryId
  status?: string;        // req.query.status
  soldRange?: string;     // req.query.soldRange
  sortBy?: string;        // req.query.sortBy
  brandId?: string;       // req.query.brandId

  flatten?: boolean;      // req.query.flatten === 'true'
}