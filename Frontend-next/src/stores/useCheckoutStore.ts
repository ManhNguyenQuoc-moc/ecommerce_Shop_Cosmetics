"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheckoutState } from "@/src/@core/type/checkout";

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      mode: "cart",
      items: [],
      info: { name: "", phone: "", addresses: [] },
      shippingMethod: "standard",
      paymentMethod: "cod",

      setInfo: (data) => set((state) => ({ info: { ...state.info, ...data } })),
      setShipping: (v) => set({ shippingMethod: v }),
      setPayment: (v) => set({ paymentMethod: v }),
      setBuyNow: (item) => set({ mode: "buy_now", items: [item] }),
      setCartMode: () => set({ mode: "cart", items: [] }),
      reset: () =>
        set({
          mode: "cart",
          items: [],
          info: { name: "", phone: "", addresses: [] },
          shippingMethod: "standard",
          paymentMethod: "cod",
        }),
    }),
    {
      name: "checkout-storage",
      partialize: (state) => ({
        items: state.items,
        info: { addresses: state.info.addresses }, 
      }),
    }
  )
);