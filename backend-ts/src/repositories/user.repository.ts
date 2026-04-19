import { User, Prisma, AccountType } from "@prisma/client";
import { IUserRepository } from "../interfaces/IUserRepository";
import { prisma } from "../config/prisma";
import { CreateUserDTO, UpdateUserDTO, UserQueryFiltersDTO } from "../DTO/user/user.dto";

export class UserRepository implements IUserRepository {
  private async attachRole(user: User): Promise<User & { role?: string | null }>;
  private async attachRole(user: null): Promise<null>;
  private async attachRole(user: User | null): Promise<(User & { role?: string | null }) | null>;
  private async attachRole(user: User | null): Promise<(User & { role?: string | null }) | null> {
    if (!user) return null;
    const role = user.roleId
      ? await prisma.rbacRole.findUnique({ where: { id: user.roleId }, select: { name: true } })
      : null;
    return { ...user, role: role?.name || null };
  }

  async findAll(skip?: number, take?: number, filters?: UserQueryFiltersDTO): Promise<[(User & { role?: string | null })[], number]> {
    const where: any = {};
    if (filters?.search) {
      where.OR = [
        { full_name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters?.roleId && filters.roleId !== 'all') {
      where.roleId = filters.roleId;
    }
    if (filters?.accountType) {
      where.accountType = filters.accountType;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: { addresses: true }
      }),
      prisma.user.count({ where })
    ]);

    const usersWithRole = await Promise.all(users.map((user) => this.attachRole(user)));
    return [usersWithRole as (User & { role?: string | null })[], total];
  }

  async findById(id: string): Promise<(User & { role?: string | null }) | null> {
    return this.attachRole(await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    }));
  }

  async findByEmail(email: string, tx?: Prisma.TransactionClient): Promise<(User & { role?: string | null }) | null> {
    const db = tx || prisma;
    return this.attachRole(await db.user.findUnique({
      where: { email },
    }));
  }

  async findByPhone(phone: string, tx?: Prisma.TransactionClient): Promise<(User & { role?: string | null }) | null> {
    const db = tx || prisma;
    return this.attachRole(await db.user.findUnique({
      where: { phone },
    }));
  }

  async create(data: CreateUserDTO, tx?: Prisma.TransactionClient): Promise<User & { role?: string | null }> {
    const db = tx || prisma;
    const user = await db.user.create({ 
      data: {
        ...data,
        birthday: data.birthday ? new Date(data.birthday) : null,
      } as any 
    });

    return (await this.attachRole(user)) as User & { role?: string | null };
  }

  async update(id: string, data: UpdateUserDTO, tx?: Prisma.TransactionClient): Promise<User & { role?: string | null }> {
    const db = tx || prisma;
    const { full_name, phone, gender, birthday, avatar, addresses, is_verified, roleId, accountType, is_point_wallet_locked } = data;
    
    // Check if phone is being updated and if it's already used by another user
    if (phone !== undefined && phone !== null) {
      const existingUserWithPhone = await db.user.findUnique({
        where: { phone },
      });
      
      if (existingUserWithPhone && existingUserWithPhone.id !== id) {
        throw new Error(`Số điện thoại ${phone} đã được sử dụng bởi tài khoản khác.`);
      }
    }
    
    const updateData: any = {};
    if (full_name !== undefined) updateData.full_name = full_name;
    if (phone !== undefined) updateData.phone = phone;
    if (gender !== undefined) updateData.gender = gender;
    if (avatar !== undefined) updateData.avatar = avatar;
    if (is_verified !== undefined) updateData.is_verified = is_verified;
    if (roleId !== undefined) updateData.roleId = roleId;
    if (accountType !== undefined) updateData.accountType = accountType;
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

    try {
      return await this.attachRole(await db.user.update({
        where: { id },
        data: updateData,
        include: {
          addresses: true,
        },
      }));
    } catch (error: any) {
      // Handle Prisma unique constraint errors with friendly message
      if (error.code === 'P2002') {
        const field = error.meta?.target?.[0];
        if (field === 'phone') {
          throw new Error(`Số điện thoại này đã được sử dụng. Vui lòng chọn số khác.`);
        } else if (field === 'email') {
          throw new Error(`Email này đã được đăng ký. Vui lòng chọn email khác.`);
        }
      }
      throw error;
    }
  }

  async findPointTransactions(userId: string): Promise<any[]> {
    return prisma.pointTransaction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20, // Limit to recent transactions
    });
  }

  async updateStatus(id: string, is_banned: boolean): Promise<User & { role?: string | null }> {
    return await this.attachRole(await prisma.user.update({
      where: { id },
      data: { is_banned },
    }));
  }

  async updateRole(id: string, roleId: string): Promise<User & { role?: string | null }> {
    return await this.attachRole(await prisma.user.update({
      where: { id },
      data: { roleId },
    }));
  }

  async updateAccountType(id: string, accountType: AccountType): Promise<User & { role?: string | null }> {
    return await this.attachRole(await prisma.user.update({
      where: { id },
      data: { accountType },
    }));
  }
}
