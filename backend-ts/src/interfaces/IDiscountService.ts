import { DiscountCode } from "@prisma/client";
import { CreateVoucherDTO, UpdateVoucherDTO, VoucherResponseDTO } from "../DTO/voucher/voucher.dto";

export interface IDiscountService {
  getAllVouchers(userId?: string, skip?: number, take?: number): Promise<{ items: VoucherResponseDTO[], total: number }>;
  getActiveVouchers(userId?: string, skip?: number, take?: number): Promise<{ items: VoucherResponseDTO[], total: number }>;
  getVoucherByCode(code: string, userId?: string): Promise<any | null>;
  createVoucher(data: CreateVoucherDTO): Promise<DiscountCode>;
  updateVoucher(id: string, data: UpdateVoucherDTO): Promise<DiscountCode>;
  deleteVoucher(id: string): Promise<void>;
}
