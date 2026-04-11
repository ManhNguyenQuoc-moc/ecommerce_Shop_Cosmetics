import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserService } from "../interfaces/IUserService";
import { User, Prisma } from "@prisma/client";
import { supabase } from "../config/supabase";
import { CreateUserDTO, UpdateUserDTO, UserQueryFiltersDTO } from "../DTO/user/user.dto";

export class UserService implements IUserService {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string, tx?: Prisma.TransactionClient): Promise<User | null> {
    return this.userRepository.findByEmail(email, tx);
  }

  async getOrCreateCustomer(customer: { email?: string, phone: string, name: string }, tx: Prisma.TransactionClient): Promise<{ user: User, rawPassword?: string }> {
    let userRecord: User | null = null;
    let userId: string | null = null;
    let rawPassword = "";

    // 1. Try to find by email if provided
    if (customer.email) {
      userRecord = await this.userRepository.findByEmail(customer.email, tx);
    }

    // 2. If not found by email, try by phone
    if (!userRecord && customer.phone) {
      userRecord = await this.userRepository.findByPhone(customer.phone, tx);
    }

    // 3. If still not found, create new account
    if (!userRecord) {
      if (customer.email) {
        // Create in Supabase Auth first
        rawPassword = `Shop@${Math.floor(100000 + Math.random() * 900000)}`;
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: customer.email,
          password: rawPassword,
          email_confirm: true,
          user_metadata: {
            full_name: customer.name,
            phone: customer.phone
          }
        });

        if (authError) {
          if (authError.message.includes("already exists")) {
            // If exists in Auth but not in our DB, we need to link it
            const { data: existingAuth } = await supabase.auth.admin.listUsers();
            const found = existingAuth.users.find(u => u.email === customer.email);
            if (found) userId = found.id;
          } else {
            throw new Error("Không thể tạo tài khoản xác thực: " + authError.message);
          }
        } else if (authData.user) {
          userId = authData.user.id;
        }
      }

      userRecord = await this.userRepository.create({
        id: userId || undefined,
        email: customer.email || null,
        full_name: customer.name,
        phone: customer.phone,
        is_verified: !!customer.email,
      }, tx);
    } else {
      // Update existing user info if needed
      userRecord = await this.userRepository.update(userRecord.id, {
        full_name: customer.name,
        phone: customer.phone,
      }, tx);
    }

    return { user: userRecord, rawPassword: rawPassword || undefined };
  }

  async createUser(data: CreateUserDTO): Promise<User> {
    this.validateAge(data.birthday);
    return this.userRepository.create(data);
  }

  async updateUser(id: string, data: UpdateUserDTO): Promise<User> {
    this.validateAge(data.birthday);
    return this.userRepository.update(id, data);
  }

  private validateAge(birthdayStr?: string | null) {
    if (!birthdayStr) return;
    const birthday = new Date(birthdayStr);
    const today = new Date();
    if (birthday > today) throw new Error("Ngày sinh không thể ở tương lai.");

    let age = today.getFullYear() - birthday.getFullYear();
    const m = today.getMonth() - birthday.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) age--;
    if (age < 16) throw new Error("Bạn phải đủ 16 tuổi.");
  }

  async getUsers(page?: number, limit?: number, filters?: UserQueryFiltersDTO): Promise<{ items: User[], total: number }> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const [items, total] = await this.userRepository.findAll(skip, limit, filters);
    return { items, total };
  }

  async getPointHistory(userId: string): Promise<any[]> {
    return this.userRepository.findPointTransactions(userId);
  }
}
