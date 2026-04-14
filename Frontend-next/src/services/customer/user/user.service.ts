import { get, patch } from "../../../@core/utils/api";
import { CustomerInfo } from "@/src/services/models/checkout/checkout"; 
import {UserProfileDTO} from "@/src/services/admin/user/models/output.model.dto"
import {UpdateUserProfileDTO} from "@/src/services/admin/user/models/input.model.dto"

export const getCustomerInfo = (userId: string) => {
  return get<CustomerInfo>(`/users/${userId}`);
};

export const getProfile = () => {
  return get<UserProfileDTO>(`/users/me`);
};

export const updateCustomerInfo = (data: Partial<UpdateUserProfileDTO>) => {
  return patch<UpdateUserProfileDTO>(`/users/me`, data);
};