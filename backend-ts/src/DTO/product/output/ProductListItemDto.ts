// product.dto.ts
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
  createdAt: Date;
  variantId?: string;
}