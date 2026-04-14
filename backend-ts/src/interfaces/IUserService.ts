import { User, Prisma, PointTransaction } from "@prisma/client";

export interface UserService {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string, tx?: Prisma.TransactionClient): Promise<User | null>;
  createUser(data: any): Promise<User>;
  updateUser(id: string, data: any): Promise<User>;
  getUsers(page?: number, limit?: number, filters?: any): Promise<{ items: any[], total: number }>;
  
  getOrCreateCustomer(customer: { email?: string, phone: string, name: string }, tx: Prisma.TransactionClient): Promise<{ user: User, rawPassword?: string }>;
  getPointHistory(userId: string): Promise<PointTransaction[]>;
  togglePointWalletStatus(userId: string, isLocked: boolean): Promise<User>;
  updateUserStatus(userId: string, is_banned: boolean): Promise<User>;
  updateUserRole(userId: string, role: string): Promise<User>;
}
