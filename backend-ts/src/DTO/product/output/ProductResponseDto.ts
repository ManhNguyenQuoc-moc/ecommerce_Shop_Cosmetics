export interface ProductResponseDto {
  id: string;
  name: string;

  brand: {
    id: string;
    name: string;
  };

  category: {
    id: string;
    name: string;
  };

  status: string;

  short_description?: string;
  long_description?: string;

  rating: number;
  reviewCount: number;
  commentCount: number;

  images: string[];

  specifications: {
    label: string;
    value: string;
  }[];

  variants: VariantResponseDto[];

  createdAt: Date;
  updatedAt: Date;
}
export interface VariantResponseDto {
  id: string;

  color?: string;
  size?: string;
  sku?: string;

  price: number;
  salePrice?: number;

  statusName?: string;

  imageUrl?: string;

  createdAt: Date;
  updatedAt: Date;
}