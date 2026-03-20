import { Cart, CartItem } from "@prisma/client";

export interface ICartService {
  getCartByUserId(userId: string): Promise<Cart>;
  addItemToCart(userId: string, variantId: string, quantity: number): Promise<CartItem>;
  removeItemFromCart(cartItemId: string): Promise<void>;
  updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItem>;
  clearCart(userId: string): Promise<void>;
}
