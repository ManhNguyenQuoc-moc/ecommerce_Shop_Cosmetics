"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
type CustomerInfo = {
  name: string;
  phone: string;
  address: string;
};

type CheckoutItem = {
  id: string;
  productId: string;
  variantId: string;

  productName: string;
  image: string;
  price: number;
  quantity: number;
};

type CheckoutState = {
  mode: "cart" | "buy_now";

  items: CheckoutItem[]; 

  info: CustomerInfo;
  shippingMethod: "standard" | "express";
  paymentMethod: "cod" | "bank";

  setInfo: (data: Partial<CustomerInfo>) => void;
  setShipping: (v: CheckoutState["shippingMethod"]) => void;
  setPayment: (v: CheckoutState["paymentMethod"]) => void;

  setBuyNow: (item: CheckoutItem) => void;
  setCartMode: () => void;

  reset: () => void;
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      mode: "cart",
      items: [],

      info: {
        name: "",
        phone: "",
        address: "",
      },

      shippingMethod: "standard",
      paymentMethod: "cod",

      setInfo: (data) =>
        set((state) => ({
          info: { ...state.info, ...data },
        })),

      setShipping: (v) => set({ shippingMethod: v }),
      setPayment: (v) => set({ paymentMethod: v }),

      setBuyNow: (item) =>
        set({
          mode: "buy_now",
          items: [item],
        }),

      setCartMode: () =>
        set({
          mode: "cart",
          items: [],
        }),

      reset: () =>
        set({
          mode: "cart",
          items: [],
          info: { name: "", phone: "", address: "" },
          shippingMethod: "standard",
          paymentMethod: "cod",
        }),
    }),
    {
      name: "checkout-storage",
    }
  )
);