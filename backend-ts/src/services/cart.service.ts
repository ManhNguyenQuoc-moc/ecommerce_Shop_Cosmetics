import { Cart, CartItem } from "@prisma/client";
import { ICartRepository } from "../interfaces/ICartRepository";
import { ICartService } from "../interfaces/ICartService";

export class CartService implements ICartService {
  private readonly cartRepository: ICartRepository;

  constructor(cartRepository: ICartRepository) {
    this.cartRepository = cartRepository;
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }
    return cart;
  }

  async addItemToCart(userId: string, variantId: string, quantity: number): Promise<CartItem> {
    const cart = await this.getCartByUserId(userId);
    return this.cartRepository.addItem(cart.id, variantId, quantity);
  }

  async removeItemFromCart(cartItemId: string): Promise<void> {
    return this.cartRepository.removeItem(cartItemId);
  }

  async updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItem> {
    return this.cartRepository.updateItemQuantity(cartItemId, quantity);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (cart) {
      await this.cartRepository.clearCart(cart.id);
    }
  }
}
