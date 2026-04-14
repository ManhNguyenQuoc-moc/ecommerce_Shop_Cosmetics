"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItemOutputDto } from "../services/models/cart/output.dto";

export type CartItem = CartItemOutputDto;

type CartState = {
  items: CartItem[];
  isLoading: boolean;
  isMerging: boolean;
  hasSynced: boolean;

  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  setIsMerging: (isMerging: boolean) => void;
  setHasSynced: (hasSynced: boolean) => void;
  reset: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isLoading: false,
      isMerging: false,
      hasSynced: false,

      setItems: (items) => set({ items }),
      setLoading: (loading) => set({ isLoading: loading }),
      setIsMerging: (isMerging) => set({ isMerging }),
      setHasSynced: (hasSynced) => set({ hasSynced }),
      reset: () => set({ items: [], isLoading: false, isMerging: false, hasSynced: false }),
    }),
    {
      name: "cart-storage",
    }
  )
);