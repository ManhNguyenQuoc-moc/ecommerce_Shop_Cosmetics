import { User } from "@prisma/client";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: any): Promise<User>;
  update(id: string, data: any): Promise<User>;
  findAll(skip?: number, take?: number, filters?: any): Promise<[User[], number]>;
}
