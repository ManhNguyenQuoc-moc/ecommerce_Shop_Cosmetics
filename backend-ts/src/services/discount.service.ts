import { IDiscountRepository } from "../interfaces/IDiscountRepository";
import { IDiscountService } from "../interfaces/IDiscountService";
import { DiscountCode } from "@prisma/client";
import { prisma } from "../config/prisma";
import { CreateVoucherDTO, UpdateVoucherDTO, VoucherResponseDTO } from "../DTO/voucher/voucher.dto";

export class DiscountService implements IDiscountService {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async getAllVouchers(userId?: string): Promise<VoucherResponseDTO[]> {
    const vouchers = await this.discountRepository.findAll();
    return this.mapVouchersWithUsage(vouchers, userId);
  }

  async getActiveVouchers(userId?: string): Promise<VoucherResponseDTO[]> {
    const vouchers = await this.discountRepository.findAllActive();
    return this.mapVouchersWithUsage(vouchers, userId);
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

  async getVoucherByCode(code: string): Promise<DiscountCode | null> {
    return this.discountRepository.findByCode(code);
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
