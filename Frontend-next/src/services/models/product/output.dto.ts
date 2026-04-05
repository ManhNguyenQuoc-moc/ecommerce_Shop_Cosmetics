// product.output.dto.ts

export type ProductStatusTag = 'BEST_SELLING' | 'TRENDING' | 'NEW' | 'SALE';

export interface BaseVariantDto {
  id: string;
  sku?: string;
  color?: string | null;
  size?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number;
  stock: number;
  image?: string | null;
  imageId?: string | null;
  soldCount: number;
  statusName?: ProductStatusTag | string;
  createdAt: string;
  updatedAt?: string;
}

export interface ProductListItemDto {
  id: string;
  slug: string;
  name: string;
  brand: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  image: string | null;

  price: number;
  salePrice: number | null;

  minPrice?: number;
  maxPrice?: number;

  sold: number;
  stock: number;

  status: string;
  createdAt: string;
  variantId?: string;
}

export interface ProductListResponseDto {
  products: ProductListItemDto[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Used within ProductDetailDto
 */
export interface ProductDetailVariantDto extends BaseVariantDto {}

export interface ProductDetailDto {
  id: string;
  name: string;
  slug: string;

  brand?: { id: string; name: string; slug?: string } | null;
  category?: { id: string; name: string; slug?: string } | null;

  brandId: string;
  categoryId: string;

  status: string;
  statusRaw: "ACTIVE" | "HIDDEN" | "STOPPED";
  price: number;
  salePrice: number | null;

  description?: string;
  short_description?: string;
  long_description?: string;

  images: string[];

  productImages: {
    id: string;
    productId: string;
    imageId: string;
    order: number;
    image: {
      id: string;
      url: string;
    };
  }[];

  rating: number;
  reviewCount: number;
  commentCount: number;

  sold: number;
  totalStock: number;

  priceRange: {
    min: number;
    max: number;
  };

  variants: ProductDetailVariantDto[];

  specifications: {
    label: string;
    value: string;
  }[];
  reviews: {
    id: string;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: {
      id: string;
      full_name: string;
    };
  }[];

  createdAt: string;
  updatedAt: string;
}

/**
 * Used in Variant List (Admin)
 */
export interface ProductVariantDto extends BaseVariantDto {
  productId: string;
  productName?: string;
  name: string; // Combined name like "Product A - Red - XL"
  brand: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
  status: string; // Display status
  productStatus?: string;
}

export interface VariantListResponseDto {
  variants: ProductVariantDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface VariantDetailDto extends BaseVariantDto {
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  status: string;
  statusRaw: string;
  
  batches: {
    id: string;
    batchNumber: string;
    expiryDate: string;
    manufacturingDate?: string | null;
    quantity: number;
    costPrice: number;
    totalIn: number;
    totalOut: number;
    createdAt: string;
  }[];
}
