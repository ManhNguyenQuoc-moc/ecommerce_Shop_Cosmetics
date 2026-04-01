// product.dto.ts
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
  createdAt: Date;
  variantId?: string;
}