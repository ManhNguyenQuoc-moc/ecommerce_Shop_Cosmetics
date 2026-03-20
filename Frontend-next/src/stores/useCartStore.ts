"use client";

import { create } from "zustand";
import {
  showNotificationSuccess,
  showNotificationError,
} from "@/src/@core/utils/message";
import { persist } from "zustand/middleware";
export type CartItem = {
  id: string;
  productId: string;
  variantId: string;

  productName: string;
  brand: string;
  image: string;

  price: number;
  originalPrice?: number;

  quantity: number;
};

type CartState = {
  items: CartItem[];

  setItems: (items: CartItem[]) => void;

  addItem: (item: CartItem) => void;

  updateQuantity: (id: string, quantity: number) => void;

  removeItem: (id: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  
  getCount: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      setItems: (items) => set({ items }),

      addItem: (item) =>
        set((state) => {
          try {
            const exist = state.items.find((i) => i.id === item.id);

            if (exist) {
              showNotificationSuccess(`Đã tăng số lượng sản phẩm ${item.productName}`);
              return {
                items: state.items.map((i) =>
                  i.id === item.id
                    ? { ...i, quantity: i.quantity + item.quantity }
                    : i
                ),
              };
            }

            showNotificationSuccess(`Đã thêm ${item.productName} vào giỏ hàng`);
            return { items: [...state.items, item] };
          } catch (err) {
            showNotificationError("Thêm vào giỏ hàng thất bại");
            return state;
          }
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
      
          return { items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)) };
        }),

      removeItem: (id) =>
        set((state) => {
      
          return { items: state.items.filter((i) => i.id !== id) };
        }),
      clearCart: () => set({ items: [] }),
      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "cart-storage", // 💡 Tên key bắt buộc phải khác với bên checkout nhé!
    }
  )
);