import { get, post } from "../../../@core/utils/api";
import {CheckoutRequestDTO} from "../../models/checkout/input.dto";
import { CheckoutResponseDTO } from "../../models/checkout/output.dto";

export const checkoutService = {
  createOrder: async (data: CheckoutRequestDTO): Promise<CheckoutResponseDTO> => {
    return post<CheckoutResponseDTO>("/orders/checkout", data);
  },
  getOrder: async (orderId: string) => {
    return get(`/orders/${orderId}`);
  },
};
