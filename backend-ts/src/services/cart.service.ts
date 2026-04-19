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

  private readonly MAX_ITEMS = 5;

  async getCartByUserId(userId: string): Promise<CartDto> {
    let cart = await this.cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await this.cartRepository.create(userId);
    }
    return this.mapToDto(cart as any);
  }

  async addItemToCart(userId: string, variantId: string, quantity: number): Promise<CartDto> {
    const cart = await this.cartRepository.findByUserId(userId) || await this.cartRepository.create(userId);
    const existingItem = (cart as any).items?.find((i: any) => i.variantId === variantId);
    const currentQty = existingItem ? (existingItem as any).quantity : 0;
    const requestedQty = currentQty + quantity;

    if (requestedQty > this.MAX_ITEMS) {
        throw new Error(`Bạn chỉ có thể thêm tối đa ${this.MAX_ITEMS} sản phẩm cho mỗi loại.`);
    }

    const stockMap = await this.inventoryService.getStockForVariants([variantId]);
    const available = stockMap[variantId]?.availableStock || 0;
    
    if (available < requestedQty) {
      throw new Error(`Sản phẩm không đủ hàng hợp lệ (còn ${available} sản phẩm, bạn đã có ${currentQty} trong giỏ).`);
    }

    await this.cartRepository.addItem(cart.id, variantId, quantity);
    return this.getCartByUserId(userId);
  }

  async removeItemFromCart(userId: string, cartItemId: string): Promise<CartDto> {
    await this.cartRepository.removeItem(cartItemId);
    return this.getCartByUserId(userId);
  }

  async updateItemQuantity(userId: string, cartItemId: string, quantity: number): Promise<CartDto> {
    if (quantity > this.MAX_ITEMS) {
        throw new Error(`Số lượng tối đa cho mỗi sản phẩm là ${this.MAX_ITEMS}.`);
    }

    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) throw new Error("Giỏ hàng không tồn tại");
    
    const item = (cart as any).items?.find((i: any) => i.id === cartItemId);
    if (!item) throw new Error("Sản phẩm không có trong giỏ hàng");

    const variantId = (item as any).variantId;
    const stockMap = await this.inventoryService.getStockForVariants([variantId]);
    const available = stockMap[variantId]?.availableStock || 0;

    if (available < quantity) {
      throw new Error(`Cập nhật thất bại: Sản phẩm chỉ còn tối đa ${available} sản phẩm hợp lệ.`);
    }

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
    const cart = await this.cartRepository.findByUserId(userId) || await this.cartRepository.create(userId);
    const existingItems = (cart as any).items || [];
    
    const variantIds = items.map(i => i.variantId);
    const stockMap = await this.inventoryService.getStockForVariants(variantIds);
    
    for (const item of items) {
       const existingItem = existingItems.find((ei: any) => ei.variantId === item.variantId);
       const existingQty = existingItem ? existingItem.quantity : 0;
       
       // Calculate new quantity with cap
       let targetQty = existingQty + item.quantity;
       if (targetQty > this.MAX_ITEMS) targetQty = this.MAX_ITEMS;
       
       // Check stock for the combined quantity
       const available = stockMap[item.variantId]?.availableStock || 0;
       if (available < targetQty) {
          targetQty = available; // Adjust to available stock if capped by it
       }

       // Calculate how much MORE we need to add to reach targetQty
       const addedQty = targetQty - existingQty;
       
       if (addedQty > 0) {
          await this.cartRepository.addItem(cart.id, item.variantId, addedQty);
       }
    }
    
    return this.getCartByUserId(userId);
  }

  private async mapToDto(cart: any): Promise<CartDto> {
    const variantIds = cart.items.map((item: any) => item.variantId);
    const stockMap = await this.inventoryService.getStockForVariants(variantIds);

    const items: CartItemDto[] = cart.items.map((item: any) => {
      const v = item.variant;
      const p = v.product;
      const variantLabel = v?.color || v?.size;
      const cartProductName = `${p.name}${variantLabel ? ` - ${variantLabel}` : ""}`;
      
      const imageUrl = v.image?.url || p.productImages?.[0]?.image?.url || null;
      const price = v.price || p.price;
      const salePrice = v.salePrice || null;
      const activePrice = salePrice || price;

      return {
        id: item.id,
        variantId: item.variantId,
        productId: v.productId,
        productName: cartProductName,
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
