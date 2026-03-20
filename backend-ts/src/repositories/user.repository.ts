import { User } from "@prisma/client";
import { IUserRepository } from "../interfaces/IUserRepository";
import { prisma } from "../config/prisma";

export class UserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: any): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: any): Promise<User> {
    const { name, phone, addresses, ...rest } = data;
    
    const updateData: any = { ...rest };
    if (name) updateData.full_name = name;
    if (phone) updateData.phone = phone;

    return prisma.$transaction(async (tx) => {
      if (addresses) {
        // Delete all existing addresses for this user
        await tx.address.deleteMany({
          where: { userId: id },
        });

        // Create new addresses
        if (addresses.length > 0) {
          updateData.addresses = {
            create: addresses.map((addr: any) => ({
              address: addr.address,
              lat: addr.lat,
              lon: addr.lon,
              isDefault: addr.isDefault || false,
            })),
          };
        }
      }

      return tx.user.update({
        where: { id },
        data: updateData,
        include: {
          addresses: true,
        },
      });
    });
  }
}
