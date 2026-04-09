export interface ProductResponseDto {
  id: string;
  name: string;
  slug: string;

  brand: {
    id: string;
    name: string;
    slug: string;
  } | null;

  brandId: string;

  category: {
    id: string;
    name: string;
    slug: string;
  } | null;

  categoryId: string;

  status: string;
  statusRaw: string;

  short_description?: string;
  long_description?: string;

  rating: number;
  reviewCount: number;
  commentCount: number;

  images: string[];
  productImages: any[];

  specifications: {
    label: string;
    value: string;
  }[];

  variants: VariantResponseDto[];

  priceRange: {
    min: number;
    max: number;
  };
  totalStock: number;
  sold: number;

  reviews: any[];

  createdAt: Date;
  updatedAt: Date;
}

export interface VariantResponseDto {
  id: string;
  sku?: string;
  color?: string;
  size?: string;
  price: number;
  salePrice?: number | null;
  costPrice?: number;
  stock: number;
  image?: string | null;
  imageId?: string | null;
  sold: number;
  statusName?: string;
  createdAt: Date;
  updatedAt: Date;
}