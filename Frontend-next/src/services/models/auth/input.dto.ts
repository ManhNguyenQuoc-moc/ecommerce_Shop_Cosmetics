// Input DTOs cho Auth Service

export type LoginInputDto = {
  email: string;
  password: string;
};

export type RefreshLoginInputDto = {
  refreshToken: string;
};

export type LogoutInputDto = {
  refreshToken?: string;
};

export type RequestPasswordRecoveryInputDto = {
  email: string;
};

export type ResetPasswordInputDto = {
  token: string;
  newPassword: string;
};
