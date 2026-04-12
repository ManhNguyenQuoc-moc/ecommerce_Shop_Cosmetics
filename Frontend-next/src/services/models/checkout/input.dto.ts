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
    addressId?: string;
    address: string;
    lat?: number;
    lon?: number;
  };
 
  total: number;
  shippingFee: number;
  shippingMethod: string;
  paymentMethod: "COD" | "VNPAY";
};