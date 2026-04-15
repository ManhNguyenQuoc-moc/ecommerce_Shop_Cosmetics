import { IAuthService } from "../interfaces/IAuthService";
import { AuthResponseDto, VerifyEmailOutputDto } from "../DTO/auth/output/auth-output.dto";

export class AuthService implements IAuthService {
  constructor() {}

  async register(data: any): Promise<any> {
    return { message: "Redirected to Supabase Auth" };
  }

  async verifyEmail(token: string): Promise<VerifyEmailOutputDto> {
    // Handled by Supabase
    throw new Error("Handled by Supabase Auth service");
  }

  async completeVerification(token: string, password?: string): Promise<void> {
    // Handled by Supabase
    throw new Error("Handled by Supabase Auth service");
  }

  async login(email: string, password: string): Promise<AuthResponseDto> {

    throw new Error("Handled by Supabase Auth service");
  }

  async googleLogin(idToken: string): Promise<AuthResponseDto> {
    // Handled by Supabase OAuth
    throw new Error("Handled by Supabase Auth service");
  }

  async facebookLogin(accessToken: string): Promise<AuthResponseDto> {
    // Handled by Supabase OAuth
    throw new Error("Handled by Supabase Auth service");
  }
}
