import { IAuthService } from "../interfaces/IAuthService";
import { prisma } from "../config/prisma";
import { AuthResponseDto, VerifyEmailOutputDto } from "../DTO/auth/output/auth-output.dto";

/**
 * AuthService - Clean version for Supabase Integration
 * Password hashing and JWT generation are now handled by Supabase (BaaS).
 * The backend only handles profile retrieval and supplementary logic.
 */
export class AuthService implements IAuthService {
  constructor() {}

  async register(data: any): Promise<any> {
    // Note: Registration is handled by Supabase SDK in Frontend.
    // The public.User record is created via SQL Triggers.
    // This method is kept for architectural consistency but simplified.
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
    // Handled by Supabase SDK in Frontend.
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
