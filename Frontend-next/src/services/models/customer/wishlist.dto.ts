export interface WishlistProductDto {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string | null;
  price: number;
  salePrice: number | null;
  brandName: string | null;
  status: string;
  availableStock: number;
}
