export type Address = { address: string; lat?: number; lon?: number };

export type CustomerInfo = {
  name: string;
  phone: string;
  addresses: Address[];
};

export type CheckoutItem = {
  id: string;
  productId: string;
  variantId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
};

export type CheckoutState = {
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
export type CustomerInfoResponse = {
  name: string;
  phone: string;
  addresses: Address[];
};