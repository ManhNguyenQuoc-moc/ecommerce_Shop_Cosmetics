import { User } from "@prisma/client";

export interface IUserService {
  getUserById(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(data: any): Promise<User>;
  updateUser(id: string, data: any): Promise<User>;
}
