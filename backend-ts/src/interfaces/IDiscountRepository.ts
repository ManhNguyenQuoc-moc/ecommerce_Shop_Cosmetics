import { DiscountCode } from "@prisma/client";

export interface IDiscountRepository {
  findAllActive(): Promise<DiscountCode[]>;
  findByCode(code: string): Promise<DiscountCode | null>;
  findById(id: string): Promise<DiscountCode | null>;
}
