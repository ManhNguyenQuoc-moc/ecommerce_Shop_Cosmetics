import { get, post } from "../../../@core/utils/api";
import { WishlistProductDto } from "../../models/customer/wishlist.dto";

const path = "/wishlist";

const getWishlistAsync = (): Promise<WishlistProductDto[]> => {
  return get<WishlistProductDto[]>(path);
};

const toggleWishlistAsync = (variantId: string): Promise<{ added: boolean }> => {
  return post<{ added: boolean }>(`${path}/toggle`, { variantId });
};

export const wishlistService = {
  getWishlistAsync,
  toggleWishlistAsync,
};
