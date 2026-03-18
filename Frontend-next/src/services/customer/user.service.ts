import { get } from "../api";
import { CustomerInfoResponse } from "@/src/@core/type/checkout"; 

export const getCustomerInfo = (userId: string) => {
  return get<CustomerInfoResponse>(`/users/${userId}`);
};