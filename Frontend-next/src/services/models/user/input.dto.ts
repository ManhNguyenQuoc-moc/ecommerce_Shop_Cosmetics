import { Address } from "@/src/@core/type/checkout";

export type UpdateUserProfileDTO = {
  full_name?: string;
  phone?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  birthday?: string;
  addresses?: Address[];
};