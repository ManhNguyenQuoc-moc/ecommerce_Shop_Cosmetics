export type CheckoutResponseDTO = {
  success: boolean;
  message?: string;
  paymentUrl?: string;
  sepayCheckout?: {
    checkoutUrl: string;
    checkoutFields: Record<string, string | number | undefined>;
  };
  data?: {
    id: string;
    status: "pending" | "paid" | "failed";
  };
};