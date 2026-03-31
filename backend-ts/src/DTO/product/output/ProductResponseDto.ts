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

  shortDescription?: string;
  longDescription?: string;

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