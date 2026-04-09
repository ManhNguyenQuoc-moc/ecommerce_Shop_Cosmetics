import { CartDto } from "../DTO/cart/CartDto";
import { AddToCartDto } from "../DTO/cart/AddToCartDto";

export interface ICartService {
  getCartByUserId(userId: string): Promise<CartDto>;
  addItemToCart(userId: string, variantId: string, quantity: number): Promise<CartDto>;
  removeItemFromCart(userId: string, cartItemId: string): Promise<CartDto>;
  updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<CartDto>;
  clearCart(userId: string): Promise<void>;
  syncCart(userId: string, items: AddToCartDto[]): Promise<CartDto>;
}
