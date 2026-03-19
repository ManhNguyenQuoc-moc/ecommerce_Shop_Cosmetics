export type CheckoutResponseDTO = {
  success: boolean;
  message?: string;
  paymentUrl?: string;
  data?: {
    id: string;
    status: "pending" | "paid" | "failed";
  };
};