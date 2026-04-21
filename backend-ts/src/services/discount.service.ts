import { IDiscountRepository } from "../interfaces/IDiscountRepository";
import { IDiscountService } from "../interfaces/IDiscountService";
import { DiscountCode } from "@prisma/client";
import { prisma } from "../config/prisma";
import { CreateVoucherDTO, UpdateVoucherDTO, VoucherQueryFiltersDTO, VoucherResponseDTO } from "../DTO/voucher/voucher.dto";

export class DiscountService implements IDiscountService {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async getAllVouchers(userId?: string, skip?: number, take?: number, filters?: VoucherQueryFiltersDTO): Promise<{ items: VoucherResponseDTO[], total: number }> {
    return this.getVouchersWithDerivedStatus(false, userId, skip, take, filters);
  }

  async getActiveVouchers(userId?: string, skip?: number, take?: number, filters?: VoucherQueryFiltersDTO): Promise<{ items: VoucherResponseDTO[], total: number }> {
    return this.getVouchersWithDerivedStatus(true, userId, skip, take, filters);
  }

  private async getVouchersWithDerivedStatus(
    activeOnly: boolean,
    userId?: string,
    skip?: number,
    take?: number,
    filters?: VoucherQueryFiltersDTO,
  ): Promise<{ items: VoucherResponseDTO[]; total: number }> {
    const needsDerivedStatus = filters?.status === "active" || filters?.status === "out";

    if (!needsDerivedStatus) {
      const [vouchers, total] = activeOnly
        ? await this.discountRepository.findAllActive(skip, take, filters)
        : await this.discountRepository.findAll(skip, take, filters);
      const mappedVouchers = await this.mapVouchersWithUsage(vouchers, userId);
      return { items: mappedVouchers, total };
    }

    const queryFilters: VoucherQueryFiltersDTO = {
      ...(filters || {}),
      status: undefined,
    };

    const [allVouchers] = activeOnly
      ? await this.discountRepository.findAllActive(undefined, undefined, queryFilters)
      : await this.discountRepository.findAll(undefined, undefined, queryFilters);

    const now = new Date();
    const filtered = allVouchers.filter((voucher) => {
      if (filters?.status === "out") {
        return voucher.used_count >= voucher.usage_limit;
      }
      if (filters?.status === "active") {
        return (
          voucher.isActive &&
          voucher.valid_from <= now &&
          voucher.valid_until >= now &&
          voucher.used_count < voucher.usage_limit
        );
      }
      return true;
    });

    const start = skip ?? 0;
    const end = take ? start + take : undefined;
    const sliced = filtered.slice(start, end);
    const mappedVouchers = await this.mapVouchersWithUsage(sliced, userId);

    return { items: mappedVouchers, total: filtered.length };
  }

  private async mapVouchersWithUsage(vouchers: DiscountCode[], userId?: string): Promise<VoucherResponseDTO[]> {
    if (!userId) {
      return vouchers.map(v => ({ ...v, is_used_by_user: false }));
    }

    // Get all discount codes used by this user in successful orders
    const usedVoucherIds = await prisma.order.findMany({
      where: {
        userId,
        discountCodeId: { not: null },
        current_status: { not: 'CANCELLED' } 
      },
      select: { discountCodeId: true }
    });

    const usedIdsList = usedVoucherIds.map(o => o.discountCodeId);

    return vouchers.map(v => ({
      ...v,
      is_used_by_user: usedIdsList.includes(v.id)
    }));
  }

  async getVoucherByCode(code: string, userId?: string): Promise<any | null> {
    const voucher = await this.discountRepository.findByCode(code);
    if (!voucher) return null;
    
    // Map with usage info if userId is provided
    if (userId) {
      const mapped = await this.mapVouchersWithUsage([voucher], userId);
      return mapped[0] || null;
    }
    
    return { ...voucher, is_used_by_user: false };
  }

  async createVoucher(data: CreateVoucherDTO): Promise<DiscountCode> {
    const existing = await this.discountRepository.findByCode(data.code);
    if (existing) {
      throw new Error(`Mã giảm giá ${data.code} đã tồn tại.`);
    }
    return this.discountRepository.create(data);
  }

  async updateVoucher(id: string, data: UpdateVoucherDTO): Promise<DiscountCode> {
    return this.discountRepository.update(id, data);
  }

  async deleteVoucher(id: string): Promise<void> {
    return this.discountRepository.delete(id);
  }
}
