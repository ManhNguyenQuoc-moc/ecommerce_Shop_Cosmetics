export interface VerifyEmailOutputDto {
  id: string;
  email: string;
  fullName: string;
  needsPassword: boolean;
}

export interface AuthUserDto {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar: string | null;
  role: string;
}

export interface AuthResponseDto {
  user: AuthUserDto;
  token: string;
}
