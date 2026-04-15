/**
 * ProductSmallItemDto - Dùng cho sidebar (related products, brand products)
 * Optimized cho performance: chỉ fields cần thiết
 */
export interface ProductSmallItemDto {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  price: number;
  salePrice: number | null;
  rating: number | null;
  sold: number;
  status: string;
}
