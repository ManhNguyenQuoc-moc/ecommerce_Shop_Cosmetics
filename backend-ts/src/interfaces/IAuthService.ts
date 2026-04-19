import { AuthResponseDto, VerifyEmailOutputDto } from "../DTO/auth/output/auth-output.dto";

export interface IAuthService {
  register(data: any): Promise<any>;
  requestPasswordRecovery(email: string): Promise<boolean>;
  login(email: string, password: string): Promise<AuthResponseDto>;
  verifyEmail(token: string): Promise<VerifyEmailOutputDto>;
  completeVerification(token: string, password?: string): Promise<void>;
  googleLogin(idToken: string): Promise<AuthResponseDto>;
  facebookLogin(accessToken: string): Promise<AuthResponseDto>;
}
