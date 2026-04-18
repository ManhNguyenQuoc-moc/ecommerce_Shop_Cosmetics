import { Address } from "@/src/services/models/checkout/checkout";

export type UpdateUserProfileDTO = {
  full_name?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthday?: string;
  avatar?: string;
  addresses?: Address[];
};

export interface UserQueryFilters {
  search?: string;
  page?: number;
  pageSize?: number;
  role?: string;
  status?: string;
  wallet_status?: string;
}