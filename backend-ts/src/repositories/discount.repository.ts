import { DiscountCode } from "@prisma/client";
import { IDiscountRepository } from "../interfaces/IDiscountRepository";
import { prisma } from "../config/prisma";

export class DiscountRepository implements IDiscountRepository {
  async findAllActive(): Promise<DiscountCode[]> {
    const now = new Date();
    return prisma.discountCode.findMany({
      where: {
        isActive: true,
        valid_from: { lte: now },
        valid_until: { gte: now },
        // Only return vouchers that still have usage left
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findByCode(code: string): Promise<DiscountCode | null> {
    return prisma.discountCode.findUnique({
      where: { code }
    });
  }

  async findById(id: string): Promise<DiscountCode | null> {
    return prisma.discountCode.findUnique({
      where: { id }
    });
  }
}
