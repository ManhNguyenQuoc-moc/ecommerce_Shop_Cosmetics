import { DiscountCode } from "@prisma/client";
import { CreateVoucherDTO, UpdateVoucherDTO, VoucherResponseDTO } from "../DTO/voucher/voucher.dto";

export interface IDiscountService {
  getAllVouchers(userId?: string): Promise<VoucherResponseDTO[]>;
  getActiveVouchers(userId?: string): Promise<VoucherResponseDTO[]>;
  getVoucherByCode(code: string): Promise<DiscountCode | null>;
  createVoucher(data: CreateVoucherDTO): Promise<DiscountCode>;
  updateVoucher(id: string, data: UpdateVoucherDTO): Promise<DiscountCode>;
  deleteVoucher(id: string): Promise<void>;
}
