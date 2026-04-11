import { IDiscountRepository } from "../interfaces/IDiscountRepository";
import { IDiscountService } from "../interfaces/IDiscountService";
import { DiscountCode } from "@prisma/client";

export class DiscountService implements IDiscountService {
  constructor(private readonly discountRepository: IDiscountRepository) {}

  async getActiveVouchers(): Promise<DiscountCode[]> {
    return this.discountRepository.findAllActive();
  }

  async getVoucherByCode(code: string): Promise<DiscountCode | null> {
    return this.discountRepository.findByCode(code);
  }
}
