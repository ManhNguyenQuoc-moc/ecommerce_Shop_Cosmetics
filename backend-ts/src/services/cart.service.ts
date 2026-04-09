import { ICartRepository } from "../interfaces/ICartRepository";
import { ICartService } from "../interfaces/ICartService";
import { CartDto } from "../DTO/cart/CartDto";
import { CartItemDto } from "../DTO/cart/CartItemDto";
import { AddToCartDto } from "../DTO/cart/AddToCartDto";
import { InventoryService } from "./inventory.service";

export class CartService implements ICartService {
  private readonly cartRepository: ICartRepository;
  private readonly inventoryService = new InventoryService();

  constructor(cartRepository: ICartRepository) {
    this.cartRepository = cartRepository;
  }

  async getCartByUserId(userId: string): Promise<CartDto> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }
    return this.mapToDto(cart as any);
  }

  async addItemToCart(userId: string, variantId: string, quantity: number): Promise<CartDto> {
    const stockMap = await this.inventoryService.getStockForVariants([variantId]);
    const available = stockMap[variantId]?.availableStock || 0;
    
    if (available < quantity) {
      throw new Error(`Sản phẩm không đủ hàng hợp lệ (còn ${available} sản phẩm có HSD > 3 tháng).`);
    }

    const cart = await this.cartRepository.findByUserId(userId) || await this.cartRepository.create(userId);
    await this.cartRepository.addItem(cart.id, variantId, quantity);
    return this.getCartByUserId(userId);
  }

  async removeItemFromCart(userId: string, cartItemId: string): Promise<CartDto> {
    await this.cartRepository.removeItem(cartItemId);
    return this.getCartByUserId(userId);
  }

  async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<CartDto> {
    await this.cartRepository.updateItemQuantity(cartItemId, quantity);
    return this.getCartByUserId(userId);
  }

  async clearCart(userId: string): Promise<void> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (cart) {
      await this.cartRepository.clearCart(cart.id);
    }
  }

  async syncCart(userId: string, items: AddToCartDto[]): Promise<CartDto> {
    const variantIds = items.map(i => i.variantId);
    const stockMap = await this.inventoryService.getStockForVariants(variantIds);
    
    for (const item of items) {
       const available = stockMap[item.variantId]?.availableStock || 0;
       if (available < item.quantity) {
          // You could throw error or just skip/adjust. Conventionally throw for clear feedback.
          throw new Error(`Variant ${item.variantId} không đủ hàng hợp lệ (còn ${available}).`);
       }
    }

    const cart = await this.cartRepository.findByUserId(userId) || await this.cartRepository.create(userId);
    
    for (const item of items) {
      await this.cartRepository.addItem(cart.id, item.variantId, item.quantity);
    }
    
    return this.getCartByUserId(userId);
  }

  private async mapToDto(cart: any): Promise<CartDto> {
    const variantIds = cart.items.map((item: any) => item.variantId);
    const stockMap = await this.inventoryService.getStockForVariants(variantIds);

    const items: CartItemDto[] = cart.items.map((item: any) => {
      const v = item.variant;
      const p = v.product;
      
      const imageUrl = v.image?.url || p.productImages?.[0]?.image?.url || null;
      const price = v.price || p.price;
      const salePrice = v.salePrice || null;
      const activePrice = salePrice || price;

      return {
        id: item.id,
        variantId: item.variantId,
        productId: v.productId,
        productName: p.name,
        color: v.color,
        size: v.size,
        sku: v.sku,
        price: activePrice,
        originalPrice: item.variant.price || p.price || null,
        salePrice: item.variant.salePrice || null,
        quantity: item.quantity,
        subTotal: activePrice * item.quantity,
        image: imageUrl,
        brandName: p.brand?.name || null,
        stock: stockMap[item.variantId]?.totalStock || 0,
        totalStock: stockMap[item.variantId]?.totalStock || 0,
        availableStock: stockMap[item.variantId]?.availableStock || 0
      };
    });

    const totalAmount = items.reduce((sum, item) => sum + item.subTotal, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      id: cart.id,
      userId: cart.userId,
      items,
      totalAmount,
      totalItems,
      updatedAt: cart.updatedAt
    };
  }
}
