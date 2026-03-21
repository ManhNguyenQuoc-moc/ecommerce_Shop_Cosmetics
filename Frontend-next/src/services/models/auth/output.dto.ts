import { AuthUser } from "@/src/@core/utils/authStorage";

// Output DTOs cho Auth Service
// Tái sử dụng AuthUser đã có sẵn trong authStorage để đảm bảo tính nhất quán

export type LoginOutputDto = {
  token: string;
  user: AuthUser;
};
