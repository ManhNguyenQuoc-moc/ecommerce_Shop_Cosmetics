"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItemOutputDto } from "../services/models/cart/output.dto";

export type CartItem = CartItemOutputDto;

type CartState = {
  items: CartItem[];
  isLoading: boolean;

  setItems: (items: CartItem[]) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isLoading: false,

      setItems: (items) => set({ items }),
      setLoading: (loading) => set({ isLoading: loading }),
      reset: () => set({ items: [], isLoading: false }),
    }),
    {
      name: "cart-storage",
    }
  )
);