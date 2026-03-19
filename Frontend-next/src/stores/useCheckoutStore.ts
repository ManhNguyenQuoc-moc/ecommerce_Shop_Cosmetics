"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheckoutItemModel, AddressModel } from "@/src/services/models/checkout/model";

type CheckoutState = {
  mode: "cart" | "buy_now";
  items: CheckoutItemModel[];
  customer: {
    name: string;
    phone: string;
  };
  addresses: AddressModel[];
  selectedAddress: AddressModel | null;
  shippingMethod: "standard" | "express";
  paymentMethod: "cod" | "bank";
  setCustomer: (data: Partial<CheckoutState["customer"]>) => void;
  setAddresses: (list: AddressModel[]) => void;
  setSelectedAddress: (addr: AddressModel) => void;
  setShipping: (v: CheckoutState["shippingMethod"]) => void;
  setPayment: (v: CheckoutState["paymentMethod"]) => void;
  setBuyNow: (item: CheckoutItemModel) => void;
  setCartMode: (items: CheckoutItemModel[]) => void;
  reset: () => void;
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      mode: "cart",
      items: [],
      customer: {
        name: "",
        phone: "",
      },
      addresses: [],
      selectedAddress: null,
      shippingMethod: "standard",
      paymentMethod: "cod",
      setCustomer: (data) =>
        set((state) => ({
          customer: { ...state.customer, ...data },
        })),
      setAddresses: (list) =>
        set(() => ({
          addresses: list,
        })),
      setSelectedAddress: (addr) =>
        set(() => ({
          selectedAddress: addr,
        })),
      setShipping: (v) => set({ shippingMethod: v }),
      setPayment: (v) => set({ paymentMethod: v }),
      setBuyNow: (item) =>
        set({
          mode: "buy_now",
          items: [item],
        }),
      setCartMode: (items) =>
        set({
          mode: "cart",
          items,
        }),
      reset: () =>
        set({
          mode: "cart",
          items: [],
          customer: { name: "", phone: "" },
          addresses: [],
          selectedAddress: null,
          shippingMethod: "standard",
          paymentMethod: "cod",
        }),
    }),
    {
      name: "checkout-storage",
      partialize: (state) => ({
        customer: state.customer,
        mode: state.mode,
        items: state.items,
        addresses: state.addresses,
        selectedAddress: state.selectedAddress,
      }),
    }
  )
);