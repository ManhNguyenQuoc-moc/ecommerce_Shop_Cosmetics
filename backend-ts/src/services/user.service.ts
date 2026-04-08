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
    if (data.birthday) {
      const birthday = new Date(data.birthday);
      const today = new Date();

      if (birthday > today) {
        throw new Error("Ngày sinh không thể ở tương lai.");
      }

      let age = today.getFullYear() - birthday.getFullYear();
      const m = today.getMonth() - birthday.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
      }

      if (age < 16) {
        throw new Error("Bạn phải đủ 16 tuổi.");
      }
    }
    return this.userRepository.create(data);
  }

  async updateUser(id: string, data: any): Promise<User> {
    if (data.birthday) {
      const birthday = new Date(data.birthday);
      const today = new Date();

      if (birthday > today) {
        throw new Error("Ngày sinh không thể ở tương lai.");
      }

      let age = today.getFullYear() - birthday.getFullYear();
      const m = today.getMonth() - birthday.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthday.getDate())) {
        age--;
      }

      if (age < 16) {
        throw new Error("Bạn phải đủ 16 tuổi.");
      }
    }
    return this.userRepository.update(id, data);
  }

  async getUsers(page?: number, limit?: number, filters?: any): Promise<{ items: User[], total: number }> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const [items, total] = await this.userRepository.findAll(skip, limit, filters);
    return { items, total };
  }
}
