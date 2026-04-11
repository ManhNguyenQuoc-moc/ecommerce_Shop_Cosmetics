import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";

type WishlistState = {
  items: ProductListItemDto[];

  addItem: (product: ProductListItemDto) => void;
  removeItem: (id: string) => void;
  setItems: (items: ProductListItemDto[]) => void;
  isInWishlist: (id: string) => boolean;
  reset: () => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) =>
        set((state) => ({
          items: [...state.items, product],
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      setItems: (items) => set({ items }),

      isInWishlist: (id) => get().items.some((i) => i.id === id),

      reset: () => set({ items: [] }),
    }),
    {
      name: "wishlist-storage",
    }
  )
);