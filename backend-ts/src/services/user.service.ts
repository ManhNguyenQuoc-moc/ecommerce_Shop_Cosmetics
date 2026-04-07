// Workaround for Prisma type export issues
type User = any;
import { IUserRepository } from "../interfaces/IUserRepository";
import { IUserService } from "../interfaces/IUserService";

export class UserService implements IUserService {
  private readonly userRepository: IUserRepository;

  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: any): Promise<User> {
    return this.userRepository.create(data);
  }

  async updateUser(id: string, data: any): Promise<User> {
    return this.userRepository.update(id, data);
  }

  async getUsers(page?: number, limit?: number, filters?: any): Promise<{ items: User[], total: number }> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const [items, total] = await this.userRepository.findAll(skip, limit, filters);
    return { items, total };
  }
}
