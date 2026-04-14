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
  is_verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
