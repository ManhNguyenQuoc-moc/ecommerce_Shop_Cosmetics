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
  roleId?: string;
  accountType?: "CUSTOMER" | "INTERNAL";
  memberRank?: "Bronze" | "Silver" | "Gold" | "Diamond";
  status?: string;
  wallet_status?: string;
  sortBy?: "newest" | "oldest" | "name_asc" | "name_desc" | "points_desc" | "points_asc";
}