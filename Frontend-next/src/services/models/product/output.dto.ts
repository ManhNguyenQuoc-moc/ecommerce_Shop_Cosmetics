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
  brandId: string;
  categoryId: string;

  short_description?: string;
  long_description?: string;

  images: string[];

  variants: {
    id: string;
    color?: string;
    size?: string;
    price: number;
    salePrice?: number;
    image?: string | null;
  }[];

  specifications: {
    label: string;
    value: string;
  }[];
}

export interface ProductVariantDto {
  id: string;
  productId: string;
  name: string;
  color?: string;
  size?: string;
  price: number;
  salePrice?: number;
  image?: string | null;
  status: string;
}
