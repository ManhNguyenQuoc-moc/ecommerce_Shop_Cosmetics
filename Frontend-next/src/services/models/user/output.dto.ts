import { Address } from "@/src/@core/type/checkout";

export type UserProfileDTO = {
  id: string;
  email?: string;
  full_name?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthday?: string;
  addresses?: Address[];
  loyalty_points?: number;
  is_verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
};