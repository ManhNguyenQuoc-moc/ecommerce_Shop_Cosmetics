import { IAuthService } from "../interfaces/IAuthService";
import { AuthResponseDto, VerifyEmailOutputDto } from "../DTO/auth/output/auth-output.dto";
import { IUserRepository } from "../interfaces/IUserRepository";
import { supabase } from "../config/supabase";

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  private async hasAuthUserWithEmail(email: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const pageSize = 1000;
    let page = 1;

    while (page <= 10) {
      const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: pageSize });
      if (error) {
        throw new Error("Không thể kiểm tra email trong Supabase Auth: " + error.message);
      }

      const users = data?.users || [];
      if (users.some((user) => user.email?.toLowerCase() === normalizedEmail)) {
        return true;
      }

      if (users.length < pageSize) {
        return false;
      }

      page++;
    }

    return false;
  }

  async register(data: any): Promise<any> {
    const email = typeof data?.email === "string" ? data.email.trim().toLowerCase() : "";
    const phone = typeof data?.phone === "string" ? data.phone.trim() : "";
    const fullName = typeof data?.fullName === "string" ? data.fullName.trim() : "";
    const validateOnly = Boolean(data?.validateOnly);
    const id = typeof data?.id === "string" ? data.id : undefined;

    if (!email) {
      throw new Error("Email là bắt buộc.");
    }

    if (!fullName) {
      throw new Error("Họ và tên là bắt buộc.");
    }

    if (validateOnly) {
      const existingByEmail = await this.userRepository.findByEmail(email);
      if (existingByEmail) {
        throw new Error("Email này đã được đăng ký.");
      }

      if (await this.hasAuthUserWithEmail(email)) {
        throw new Error("Email này đã được đăng ký.");
      }

      if (phone) {
        const existingByPhone = await this.userRepository.findByPhone(phone);
        if (existingByPhone) {
          throw new Error("Số điện thoại này đã được sử dụng.");
        }
      }

      return { message: "Validation successful" };
    }

    if (!id) {
      throw new Error("Thiếu ID người dùng từ Supabase.");
    }

    const existingById = await this.userRepository.findById(id);
    if (existingById) {
      return {
        message: "User already synced",
        user: existingById,
      };
    }

    const existingByEmail = await this.userRepository.findByEmail(email);
    if (existingByEmail && existingByEmail.id !== id) {
      throw new Error("Email này đã được đăng ký.");
    }

    if (phone) {
      const existingByPhone = await this.userRepository.findByPhone(phone);
      if (existingByPhone && existingByPhone.id !== id) {
        throw new Error("Số điện thoại này đã được sử dụng.");
      }
    }

    const user = await this.userRepository.create({
      id,
      email,
      phone: phone || null,
      full_name: fullName,
      accountType: "CUSTOMER",
      is_verified: false,
    });

    return {
      message: "Register successfully",
      user,
    };
  }

  async requestPasswordRecovery(email: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: `${process.env.APP_URL || "http://localhost:3000"}/update-password`,
    });

    if (error) {
      throw new Error(error.message);
    }

    return true;
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
