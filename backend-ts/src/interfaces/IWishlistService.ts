export interface IWishlistService {
  getUserWishlist(userId: string): Promise<any[]>;
  toggleWishlist(userId: string, variantId: string): Promise<{ added: boolean }>;
}
