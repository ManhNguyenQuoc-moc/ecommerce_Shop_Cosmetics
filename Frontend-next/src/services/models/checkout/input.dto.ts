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
  };
  address: {
    address: string;
    lat?: number;
    lon?: number;
  };
  addressId?: string;
  total: number;
  paymentMethod: "cod" | "bank";
};