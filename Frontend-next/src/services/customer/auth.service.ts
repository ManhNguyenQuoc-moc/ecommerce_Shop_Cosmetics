import { post } from "../api";
import {
  LoginInputDto,
  LogoutInputDto,
  RefreshLoginInputDto,
  RequestPasswordRecoveryInputDto,
  ResetPasswordInputDto,
} from "../models/auth/input.dto";
import { LoginOutputDto } from "../models/auth/output.dto";

const path = "/auth";

const loginAsync = (body: LoginInputDto): Promise<LoginOutputDto> => {
  return post<LoginOutputDto>(`${path}/login`, body);
};

const refreshTokenAsync = (body: RefreshLoginInputDto): Promise<LoginOutputDto> => {
  return post<LoginOutputDto>(`${path}/refresh-login`, body);
};

const logOutAsync = (body?: LogoutInputDto): Promise<boolean> => {
  return post<boolean>(`${path}/logout`, body);
};

const requestPasswordRecovery = (body: RequestPasswordRecoveryInputDto): Promise<boolean> => {
  return post<boolean>(`${path}/request-password-recovery`, body);
};

const resetPassword = (body: ResetPasswordInputDto): Promise<boolean> => {
  return post<boolean>(`${path}/reset-password`, body);
};

export const authService = {
  loginAsync,
  refreshTokenAsync,
  logOutAsync,
  requestPasswordRecovery,
  resetPassword,
};
