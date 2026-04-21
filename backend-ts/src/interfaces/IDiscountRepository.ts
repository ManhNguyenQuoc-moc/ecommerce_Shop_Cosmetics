import { DiscountCode } from "@prisma/client";
import { CreateVoucherDTO, UpdateVoucherDTO, VoucherQueryFiltersDTO } from "../DTO/voucher/voucher.dto";

export interface IDiscountRepository {
  findAll(skip?: number, take?: number, filters?: VoucherQueryFiltersDTO): Promise<[DiscountCode[], number]>;
  findAllActive(skip?: number, take?: number, filters?: VoucherQueryFiltersDTO): Promise<[DiscountCode[], number]>;
  findByCode(code: string): Promise<DiscountCode | null>;
  findById(id: string): Promise<DiscountCode | null>;
  create(data: CreateVoucherDTO): Promise<DiscountCode>;
  update(id: string, data: UpdateVoucherDTO): Promise<DiscountCode>;
  delete(id: string): Promise<void>;
}
