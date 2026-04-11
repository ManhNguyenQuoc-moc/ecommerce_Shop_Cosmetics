import { Wishlist } from "@prisma/client";

export interface IWishlistRepository {
  findByUserId(userId: string): Promise<any[]>;
  addItem(userId: string, variantId: string): Promise<Wishlist>;
  removeItem(userId: string, variantId: string): Promise<void>;
  exists(userId: string, variantId: string): Promise<boolean>;
}
