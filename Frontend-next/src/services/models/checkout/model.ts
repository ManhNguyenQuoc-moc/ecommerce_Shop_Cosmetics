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
  id?: string;
  address: string;
  lat?: number;
  lon?: number;
};

export type CustomerModel = {
  name: string;
  phone: string;
  email: string;
};

export type CheckoutModel = {
  items: CheckoutItemModel[];
  customer: CustomerModel;
  selectedAddress: AddressModel;
  total: number;
  shippingFee: number;
  shippingMethod: string;
};

export type CheckoutResultModel = {
  success: boolean;
  message?: string;
  paymentUrl?: string;
  orderId?: string;
  status?: "pending" | "paid" | "failed";
};