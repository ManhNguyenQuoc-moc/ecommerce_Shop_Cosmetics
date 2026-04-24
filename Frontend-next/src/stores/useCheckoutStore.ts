"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheckoutItemModel, AddressModel } from "@/src/services/models/checkout/model";
import { VoucherResponseDto as VoucherDTO } from "@/src/services/models/voucher/output.dto";

type CheckoutState = {
  mode: "cart" | "buy_now";
  items: CheckoutItemModel[];
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  addresses: AddressModel[];
  selectedAddress: AddressModel | null;
  shippingMethod: "standard" | "express";
  paymentMethod: "COD" | "SEPAY" | "MOMO" | "ZALOPAY";
  appliedVoucher: VoucherDTO | null;
  setCustomer: (data: Partial<CheckoutState["customer"]>) => void;
  setAddresses: (list: AddressModel[]) => void;
  setSelectedAddress: (addr: AddressModel) => void;
  setShipping: (v: CheckoutState["shippingMethod"]) => void;
  setPayment: (v: CheckoutState["paymentMethod"]) => void;
  setVoucher: (v: VoucherDTO | null) => void;
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
        email: "",
      },
      addresses: [],
      selectedAddress: null,
      shippingMethod: "standard",
      paymentMethod: "COD",
      appliedVoucher: null,
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
      setVoucher: (v) => set({ appliedVoucher: v }),
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
          customer: { name: "", phone: "", email: "" },
          addresses: [],
          selectedAddress: null,
          shippingMethod: "standard",
          paymentMethod: "COD",
          appliedVoucher: null,
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
        shippingMethod: state.shippingMethod,
        paymentMethod: state.paymentMethod,
        appliedVoucher: state.appliedVoucher,
      }),
    }
  )
);