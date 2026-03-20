import { get, patch } from "../api";
import { CustomerInfo } from "@/src/@core/type/checkout"; 
import {UserProfileDTO} from "@/src/services/models/user/output.dto"
import {UpdateUserProfileDTO} from "@/src/services/models/user/input.dto"

export const getCustomerInfo = (userId: string) => {
  return get<CustomerInfo>(`/users/${userId}`);
};

export const getProfile = () => {
  return get<UserProfileDTO>(`/users/me`);
};

export const updateCustomerInfo = (data: Partial<UpdateUserProfileDTO>) => {
  return patch<UpdateUserProfileDTO>(`/users/me`, data);
};