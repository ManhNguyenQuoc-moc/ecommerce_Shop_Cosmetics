import { DiscountCode, Prisma } from "@prisma/client";
import { IDiscountRepository } from "../interfaces/IDiscountRepository";
import { prisma } from "../config/prisma";
import { CreateVoucherDTO, UpdateVoucherDTO, VoucherQueryFiltersDTO } from "../DTO/voucher/voucher.dto";

export class DiscountRepository implements IDiscountRepository {
  async findAll(skip?: number, take?: number, filters?: VoucherQueryFiltersDTO): Promise<[DiscountCode[], number]> {
    const where = this.buildWhere(filters, false);
    return Promise.all([
      prisma.discountCode.findMany({
        where,
        skip,
        take,
        orderBy: this.buildOrderBy(filters?.sortBy),
      }),
      prisma.discountCode.count({ where })
    ]);
  }

  async findAllActive(skip?: number, take?: number, filters?: VoucherQueryFiltersDTO): Promise<[DiscountCode[], number]> {
    const where = this.buildWhere(filters, true);
    return Promise.all([
      prisma.discountCode.findMany({
        where,
        skip,
        take,
        orderBy: this.buildOrderBy(filters?.sortBy),
      }),
      prisma.discountCode.count({ where })
    ]);
  }

  private buildWhere(filters?: VoucherQueryFiltersDTO, activeOnly?: boolean): Prisma.DiscountCodeWhereInput {
    const now = new Date();
    const and: Prisma.DiscountCodeWhereInput[] = [];

    if (filters?.search) {
      and.push({
        OR: [
          { code: { contains: filters.search, mode: "insensitive" } },
          { program_name: { contains: filters.search, mode: "insensitive" } },
          { description: { contains: filters.search, mode: "insensitive" } },
        ],
      });
    }

    if (filters?.type) {
      and.push({ type: filters.type });
    }

    if (filters?.redeemType === "point") {
      and.push({ point_cost: { gt: 0 } });
    }

    if (filters?.redeemType === "normal") {
      and.push({
        point_cost: 0,
      });
    }

    if (activeOnly) {
      and.push({
        isActive: true,
        valid_from: { lte: now },
        valid_until: { gte: now },
      });
    }

    switch (filters?.status) {
      case "pending":
        and.push({ valid_from: { gt: now } });
        break;
      case "expired":
        and.push({ OR: [{ valid_until: { lt: now } }, { isActive: false }] });
        break;
      default:
        break;
    }

    if (and.length === 0) return {};
    return { AND: and };
  }

  private buildOrderBy(sortBy?: VoucherQueryFiltersDTO["sortBy"]): Prisma.DiscountCodeOrderByWithRelationInput[] {
    switch (sortBy) {
      case "oldest":
        return [{ createdAt: "asc" }];
      case "end_soon":
        return [{ valid_until: "asc" }];
      case "end_late":
        return [{ valid_until: "desc" }];
      case "discount_desc":
        return [{ discount: "desc" }, { createdAt: "desc" }];
      case "discount_asc":
        return [{ discount: "asc" }, { createdAt: "desc" }];
      case "used_desc":
        return [{ used_count: "desc" }, { createdAt: "desc" }];
      case "used_asc":
        return [{ used_count: "asc" }, { createdAt: "desc" }];
      case "newest":
      default:
        return [{ createdAt: "desc" }];
    }
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
