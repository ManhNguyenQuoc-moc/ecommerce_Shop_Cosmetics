import { User, Prisma } from "@prisma/client";

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string, tx?: Prisma.TransactionClient): Promise<User | null>;
  createUser(data: any): Promise<User>;
  updateUser(id: string, data: any): Promise<User>;
  getUsers(page?: number, limit?: number, filters?: any): Promise<{ items: User[], total: number }>;
  
  getOrCreateCustomer(customer: { email?: string, phone: string, name: string }, tx: Prisma.TransactionClient): Promise<{ user: User, rawPassword?: string }>;
  getPointHistory(userId: string): Promise<any[]>;
}
