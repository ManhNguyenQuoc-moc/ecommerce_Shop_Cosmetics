export type CheckoutItemModel = {
  id:string
  productId: string;
  variantId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
};

export type AddressModel = {
  address: string;
  lat?: number;
  lon?: number;
};

export type CustomerModel = {
  name: string;
  phone: string;
};

export type CheckoutModel = {
  items: CheckoutItemModel[];
  customer: CustomerModel;
  selectedAddress: AddressModel;
  total: number;
};

export type CheckoutResultModel = {
  success: boolean;
  message?: string;
  paymentUrl?: string;
  orderId?: string;
  status?: "pending" | "paid" | "failed";
};