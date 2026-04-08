"use client";

import { create, StateCreator } from "zustand";
import {
  showNotificationSuccess,
  showNotificationError,
} from "@/src/@core/utils/message";
import { persist, PersistOptions } from "zustand/middleware";
import { cartService } from "@/src/services/customer/cart.service";
import { authStorage } from "@/src/@core/utils/authStorage";
import { CartItemOutputDto, CartOutputDto } from "../services/models/cart/output.dto";
import { mutate } from "swr";

export type CartItem = CartItemOutputDto;

type CartState = {
  items: CartItem[];
  isLoading: boolean;

  setItems: (items: CartItem[]) => void;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  reset: () => void;
  fetchCart: () => Promise<void>;
  syncCart: () => Promise<void>;
  
  getTotal: () => number;
  getCount: () => number;
};

type CartPersist = (
  config: StateCreator<CartState, [], [["zustand/persist", unknown]]>,
  options: PersistOptions<CartState>
) => StateCreator<CartState>;

export const useCartStore = create<CartState>()(
  (persist as CartPersist)(
    (set, get) => ({
      items: [],
      isLoading: false,

      setItems: (items: CartItem[]) => set({ items }),

      fetchCart: async () => {
        const user = authStorage.getUser();
        if (!user?.id) return;
        
        set({ isLoading: true });
        try {
          const data = await cartService.getCartAsync(user.id);
          set({ items: data.items || [] });
          // Also sync with SWR cache
          mutate(`/carts/${user.id}`, data, false);
        } catch (err) {
          console.error("Fetch cart error:", err);
        } finally {
          set({ isLoading: false });
        }
      },

      syncCart: async () => {
        const user = authStorage.getUser();
        if (!user?.id) return;

        const currentItems = get().items;
        if (currentItems.length === 0) {
          await get().fetchCart();
          return;
        }

        try {
          const syncData = currentItems.map(i => ({ variantId: i.variantId, quantity: i.quantity }));
          const data = await cartService.syncCartAsync(user.id, syncData);
          set({ items: data.items || [] });
          showNotificationSuccess("Đã đồng bộ giỏ hàng");
        } catch (err) {
          console.error("Sync cart error:", err);
          await get().fetchCart();
        }
      },

      addItem: async (item) => {
        const user = authStorage.getUser();
        
        if (user?.id) {
          try {
            const data = await cartService.addItemAsync(user.id, item.variantId, item.quantity);
            set({ items: data.items });
            mutate(`/carts/${user.id}`, data, false);
            showNotificationSuccess(`Đã thêm ${item.productName} vào giỏ hàng`);
          } catch (err) {
            showNotificationError("Không thể thêm vào giỏ hàng server");
          }
          return;
        }

        // Guest logic
        set((state) => {
          const exist = state.items.find((i) => i.variantId === item.variantId);
          if (exist) {
            showNotificationSuccess(`Đã tăng số lượng sản phẩm ${item.productName}`);
            return {
              items: state.items.map((i) =>
                i.variantId === item.variantId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            };
          }
          showNotificationSuccess(`Đã thêm ${item.productName} vào giỏ hàng`);
          return { items: [...state.items, item] };
        });
      },

      updateQuantity: async (id, quantity) => {
        const user = authStorage.getUser();

        if (user?.id) {
          try {
            const data = await cartService.updateQuantityAsync(user.id, id, quantity);
            set({ items: data.items });
            mutate(`/carts/${user.id}`, data, false);
          } catch (err) {
            showNotificationError("Cập nhật số lượng thất bại");
          }
          return;
        }

        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
        }));
      },

      removeItem: async (id) => {
        const user = authStorage.getUser();

        if (user?.id) {
          try {
            const data = await cartService.removeItemAsync(user.id, id);
            set({ items: data.items });
            mutate(`/carts/${user.id}`, data, false);
            showNotificationSuccess("Đã xóa sản phẩm khỏi giỏ hàng");
          } catch (err) {
            showNotificationError("Xóa sản phẩm thất bại");
          }
          return;
        }

        set((state) => ({
          items: state.items.filter((i) => i.id !== id)
        }));
      },

      clearCart: async () => {
        const user = authStorage.getUser();
        if (user?.id) {
          try {
            await cartService.clearCartAsync(user.id);
            mutate(`/carts/${user.id}`, null, false);
          } catch (err) {}
        }
        set({ items: [] });
      },

      reset: () => set({ items: [], isLoading: false }),

      getTotal: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),

      getCount: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "cart-storage", // 💡 Tên key bắt buộc phải khác với bên checkout nhé!
    }
  )
);