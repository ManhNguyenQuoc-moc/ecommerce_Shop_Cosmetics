import { Address } from "@/src/services/models/checkout/checkout";

export type UserProfileDTO = {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthday?: string;
  avatar?: string;
  role?: "CUSTOMER" | "ADMIN";
  addresses?: Address[];
  loyalty_points?: number;
  lifetime_points?: number;
  used_points?: number;
  member_rank?: string;
  is_verified?: boolean;
  is_point_wallet_locked?: boolean;
  createdAt?: string;
  updatedAt?: string;
  is_banned?: boolean;
};
