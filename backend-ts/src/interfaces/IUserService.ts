import { User, Prisma, PointTransaction, AccountType } from "@prisma/client";

export interface UserService {
  getUserById(id: string): Promise<(User & { role?: string | null }) | null>;
  getUserByEmail(email: string, tx?: Prisma.TransactionClient): Promise<(User & { role?: string | null }) | null>;
  createUser(data: any): Promise<User & { role?: string | null }>;
  updateUser(id: string, data: any): Promise<User & { role?: string | null }>;
  getUsers(page?: number, limit?: number, filters?: any): Promise<{ items: Array<User & { role?: string | null }>, total: number }>;
  getUserWithRank(id: string): Promise<(User & { role?: string | null; member_rank?: string; used_points?: number }) | null>;

  getOrCreateCustomer(customer: { email?: string, phone: string, name: string }, tx: Prisma.TransactionClient): Promise<{ user: User & { role?: string | null }, rawPassword?: string }>;
  getPointHistory(userId: string): Promise<PointTransaction[]>;
  togglePointWalletStatus(userId: string, isLocked: boolean): Promise<User & { role?: string | null }>;
  updateUserStatus(userId: string, is_banned: boolean): Promise<User & { role?: string | null }>;
  updateUserRole(userId: string, roleId: string): Promise<User & { role?: string | null }>;
  updateUserAccountType(userId: string, accountType: AccountType): Promise<User & { role?: string | null }>;
}
