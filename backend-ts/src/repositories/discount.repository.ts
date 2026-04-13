import { DiscountCode } from "@prisma/client";
import { IDiscountRepository } from "../interfaces/IDiscountRepository";
import { prisma } from "../config/prisma";
import { CreateVoucherDTO, UpdateVoucherDTO } from "../DTO/voucher/voucher.dto";

export class DiscountRepository implements IDiscountRepository {
  async findAll(): Promise<DiscountCode[]> {
    return prisma.discountCode.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
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

  async create(data: CreateVoucherDTO): Promise<DiscountCode> {
    return prisma.discountCode.create({
      data: {
        code: data.code,
        program_name: data.program_name,
        description: data.description,
        discount: data.discount,
        type: data.type,
        min_order_value: data.min_order_value,
        max_discount: data.max_discount,
        point_cost: data.point_cost,
        valid_from: data.valid_from,
        valid_until: data.valid_until,
        usage_limit: data.usage_limit,
        isActive: data.isActive,
      }
    });
  }

  async update(id: string, data: UpdateVoucherDTO): Promise<DiscountCode> {
    const updateData: any = { ...data };
    return prisma.discountCode.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.discountCode.delete({
      where: { id }
    });
  }
}
