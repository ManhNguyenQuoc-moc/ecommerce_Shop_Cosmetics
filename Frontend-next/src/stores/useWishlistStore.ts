import { create } from "zustand";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";
import { showNotificationSuccess } from "@/src/@core/utils/message";

type WishlistState = {
  items: ProductListItemDto[];

  addItem: (product: ProductListItemDto) => void;
  removeItem: (id: string) => void;
  toggleItem: (product: ProductListItemDto) => void;

  isInWishlist: (id: string) => boolean;
};

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],

  addItem: (product) =>
    set((state) => ({
      items: [...state.items, product],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),

 toggleItem: (product) => {
  const exist = get().items.find((i) => i.id === product.id);

  if (exist) {
    showNotificationSuccess("Đã xóa khỏi wishlist 💔");

    set((state) => ({
      items: state.items.filter((i) => i.id !== product.id),
    }));
  } else {
    showNotificationSuccess("Đã thêm vào wishlist ❤️");

    set((state) => ({
      items: [...state.items, product],
    }));
  }
},

  isInWishlist: (id) => {
    return get().items.some((i) => i.id === id);
  },
}));