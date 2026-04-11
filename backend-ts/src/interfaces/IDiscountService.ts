import { DiscountCode } from "@prisma/client";

export interface IDiscountService {
  getActiveVouchers(): Promise<DiscountCode[]>;
  getVoucherByCode(code: string): Promise<DiscountCode | null>;
}
