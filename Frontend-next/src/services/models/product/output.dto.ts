// product.output.dto.ts
export interface ProductListItemDto {
  id: string;
  slug: string;
  name: string;
  brand: string | null;
  category: string;
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

export interface ProductDetailDto {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  statusRaw: 'ACTIVE' | 'HIDDEN' | 'STOPPED';
  short_description?: string;
  long_description?: string;
  images: string[];
  productImages: Array<{
    productId: string;
    imageId: string;
    order: number;
    image: {
      url: string;
    };
  }>;
  specifications: {
    label: string;
    value: string;
  }[];
  variants: {
    id: string;
    sku?: string;
    color?: string;
    size?: string;
    price: number;
    salePrice?: number | null;
    stock: number;
    image?: string | null;
    imageId?: string | null;
    statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
    soldCount: number;
  }[];
}

export interface ProductVariantDto {
  id: string;
  productId: string;
  productName?: string;
  name: string;
  sku?: string;
  color?: string;
  size?: string;
  price: number;
  salePrice?: number | null;
  image?: string | null;
  status: string;
  statusName?: 'BEST_SELLING' | 'TRENDING' | 'NEW';
  createdAt: string;
}
export interface VariantListResponseDto {
  variants: ProductVariantDto[];
  total: number;
  page: number;
  pageSize: number;
}
