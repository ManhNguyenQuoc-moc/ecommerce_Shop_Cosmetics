import { User, Prisma, AccountType } from "@prisma/client";
import { CreateUserDTO, UpdateUserDTO, UserQueryFiltersDTO } from "../DTO/user/user.dto";

export interface IUserRepository {
  findById(id: string): Promise<(User & { role?: string | null }) | null>;
  findByEmail(email: string, tx?: Prisma.TransactionClient): Promise<(User & { role?: string | null }) | null>;
  findByPhone(phone: string, tx?: Prisma.TransactionClient): Promise<(User & { role?: string | null }) | null>;
  create(data: CreateUserDTO, tx?: Prisma.TransactionClient): Promise<User & { role?: string | null }>;
  update(id: string, data: UpdateUserDTO, tx?: Prisma.TransactionClient): Promise<User & { role?: string | null }>;
  findAll(skip?: number, take?: number, filters?: UserQueryFiltersDTO): Promise<[(User & { role?: string | null })[], number]>;
  findPointTransactions(userId: string): Promise<any[]>;
  updateStatus(id: string, is_banned: boolean): Promise<User & { role?: string | null }>;
  updateRole(id: string, roleId: string): Promise<User & { role?: string | null }>;
  updateAccountType(id: string, accountType: AccountType): Promise<User & { role?: string | null }>;
}
