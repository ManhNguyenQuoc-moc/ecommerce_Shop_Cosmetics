import { User, Prisma } from "@prisma/client";
import { CreateUserDTO, UpdateUserDTO, UserQueryFiltersDTO } from "../DTO/user/user.dto";

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string, tx?: Prisma.TransactionClient): Promise<User | null>;
  findByPhone(phone: string, tx?: Prisma.TransactionClient): Promise<User | null>;
  create(data: CreateUserDTO, tx?: Prisma.TransactionClient): Promise<User>;
  update(id: string, data: UpdateUserDTO, tx?: Prisma.TransactionClient): Promise<User>;
  findAll(skip?: number, take?: number, filters?: UserQueryFiltersDTO): Promise<[User[], number]>;
  findPointTransactions(userId: string): Promise<any[]>;
  updateStatus(id: string, is_banned: boolean): Promise<User>;
  updateRole(id: string, role: string): Promise<User>;
}
