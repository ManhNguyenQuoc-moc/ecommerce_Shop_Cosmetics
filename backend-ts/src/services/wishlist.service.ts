import { IWishlistRepository } from "../interfaces/IWishlistRepository";
import { IWishlistService } from "../interfaces/IWishlistService";
import { WishlistProductDto } from "../DTO/customer/wishlist.dto";

export class WishlistService implements IWishlistService {
  constructor(private readonly wishlistRepository: IWishlistRepository) {}

  async getUserWishlist(userId: string): Promise<WishlistProductDto[]> {
    const data = await this.wishlistRepository.findByUserId(userId);
    return data.map(item => this.mapToDto(item));
  }

  async toggleWishlist(userId: string, variantId: string): Promise<{ added: boolean }> {
    const isExist = await this.wishlistRepository.exists(userId, variantId);

    if (isExist) {
        await this.wishlistRepository.removeItem(userId, variantId);
        return { added: false };
    } else {
        await this.wishlistRepository.addItem(userId, variantId);
        return { added: true };
    }
  }

  private mapToDto(item: any): WishlistProductDto {
    const v = item.variant;
    const p = v.product;
    const imageUrl = v.image?.url || p.productImages?.[0]?.image?.url || null;

    return {
      id: item.id,
      variantId: v.id,
      productId: p.id,
      name: p.name,
      slug: p.slug,
      image: imageUrl,
      price: v.price || p.price,
      salePrice: v.salePrice || p.salePrice || null,
      brandName: p.brand?.name || null,
      status: v.statusName || p.status || "NEW",
      availableStock: 0 // In a real app, combine with inventory service
    };
  }
}
