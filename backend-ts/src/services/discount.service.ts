import { IDiscountRepository } from "../interfaces/IDiscountRepository";
import { IDiscountService } from "../interfaces/IDiscountService";
import { DiscountCode } from "@prisma/client";
import { prisma } from "../config/prisma";
import { CreateVoucherDTO, UpdateVoucherDTO, VoucherResponseDTO } from "../DTO/voucher/voucher.dto";

export class DiscountService implements IDiscountService {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async getAllVouchers(userId?: string, skip?: number, take?: number): Promise<{ items: VoucherResponseDTO[], total: number }> {
    const [vouchers, total] = await this.discountRepository.findAll(skip, take);
    const mappedVouchers = await this.mapVouchersWithUsage(vouchers, userId);
    return { items: mappedVouchers, total };
  }

  async getActiveVouchers(userId?: string, skip?: number, take?: number): Promise<{ items: VoucherResponseDTO[], total: number }> {
    const [vouchers, total] = await this.discountRepository.findAllActive(skip, take);
    const mappedVouchers = await this.mapVouchersWithUsage(vouchers, userId);
    return { items: mappedVouchers, total };
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
