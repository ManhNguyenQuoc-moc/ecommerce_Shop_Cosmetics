import { z } from "zod";

export const AddToWishlistSchema = z.object({
  variantId: z.string().uuid("ID biến thể không hợp lệ"),
});

export type AddToWishlistDto = z.infer<typeof AddToWishlistSchema>;

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
