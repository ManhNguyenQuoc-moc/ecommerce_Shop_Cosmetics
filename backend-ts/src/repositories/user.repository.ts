import { User, Prisma } from "@prisma/client";
import { IUserRepository } from "../interfaces/IUserRepository";
import { prisma } from "../config/prisma";
import { CreateUserDTO, UpdateUserDTO, UserQueryFiltersDTO } from "../DTO/user/user.dto";

export class UserRepository implements IUserRepository {
  async findAll(skip?: number, take?: number, filters?: UserQueryFiltersDTO): Promise<[User[], number]> {
    const where: any = {};
    if (filters?.search) {
      where.OR = [
        { full_name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters?.role && filters.role !== 'all') {
      where.role = filters.role;
    }

    return Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { addresses: true }
      }),
      prisma.user.count({ where })
    ]);
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });
  }

  async findByEmail(email: string, tx?: Prisma.TransactionClient): Promise<User | null> {
    const db = tx || prisma;
    return db.user.findUnique({
      where: { email },
    });
  }

  async findByPhone(phone: string, tx?: Prisma.TransactionClient): Promise<User | null> {
    const db = tx || prisma;
    return db.user.findUnique({
      where: { phone },
    });
  }

  async create(data: CreateUserDTO, tx?: Prisma.TransactionClient): Promise<User> {
    const db = tx || prisma;
    return db.user.create({ 
      data: {
        ...data,
        birthday: data.birthday ? new Date(data.birthday) : null,
      } as any 
    });
  }

  async update(id: string, data: UpdateUserDTO, tx?: Prisma.TransactionClient): Promise<User> {
    const db = tx || prisma;
    const { full_name, phone, gender, birthday, avatar, addresses, is_verified, role, is_point_wallet_locked } = data;
    
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (is_verified !== undefined) updateData.is_verified = is_verified;
    if (role !== undefined) updateData.role = role;
    if (birthday !== undefined) updateData.birthday = birthday ? new Date(birthday) : null;
    if (is_point_wallet_locked !== undefined) updateData.is_point_wallet_locked = is_point_wallet_locked;

    if (addresses) {
      // 1. Get current addresses
      const currentAddresses = await db.address.findMany({
        where: { userId: id },
      });

      const currentAddressStrings = currentAddresses.map(a => a.address);
      const newAddressStrings = addresses.map((a: any) => a.address);

      // 2. Delete addresses that are no longer in the list
      const toDelete = currentAddresses.filter(a => !newAddressStrings.includes(a.address));
      if (toDelete.length > 0) {
        await db.address.deleteMany({
          where: { id: { in: toDelete.map(a => a.id) } },
        });
      }

      // 3. Update or Create
      for (const addr of addresses) {
        const existing = currentAddresses.find(a => a.address === addr.address);
        if (existing) {
          // Update existing (mostly just isDefault)
          await db.address.update({
            where: { id: existing.id },
            data: {
              isDefault: addr.isDefault || false,
              lat: addr.lat,
              lon: addr.lon,
            },
          });
        } else {
          // Create new
          await db.address.create({
            data: {
              userId: id,
              address: addr.address,
              lat: addr.lat,
              lon: addr.lon,
              isDefault: addr.isDefault || false,
            },
          });
        }
      }
    }

    return db.user.update({
      where: { id },
      data: updateData,
      include: {
        addresses: true,
      },
    });
  }

  async findPointTransactions(userId: string): Promise<any[]> {
    return prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to recent transactions
    });
  }

  async updateStatus(id: string, is_banned: boolean): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { is_banned },
    });
  }

  async updateRole(id: string, role: any): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
