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

