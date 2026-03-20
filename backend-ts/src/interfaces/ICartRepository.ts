import { Cart, CartItem } from "@prisma/client";

export interface ICartRepository {
  findByUserId(userId: string): Promise<Cart | null>;
  create(userId: string): Promise<Cart>;
  addItem(cartId: string, variantId: string, quantity: number): Promise<CartItem>;
  removeItem(cartItemId: string): Promise<void>;
  updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItem>;
  clearCart(cartId: string): Promise<void>;
}
