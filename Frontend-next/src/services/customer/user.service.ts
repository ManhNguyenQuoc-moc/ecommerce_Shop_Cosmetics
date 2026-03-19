import { get } from "../api";
import { CustomerInfo } from "@/src/@core/type/checkout"; 

export const getCustomerInfo = (userId: string) => {
  return get<CustomerInfo>(`/users/${userId}`);
};