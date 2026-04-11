export type CheckoutRequestDTO = {
  items: {
    productId: string;
    variantId: string;
    productName: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  address: {
    address: string;
    lat?: number;
    lon?: number;
  };
  addressId?: string;
  total: number;
  shippingFee: number;
  shippingMethod: string;
  paymentMethod: "COD" | "VNPAY";
};