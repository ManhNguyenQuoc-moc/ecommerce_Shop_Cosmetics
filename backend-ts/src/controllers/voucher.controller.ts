import { Request, Response } from "express";
import { IDiscountService } from "../interfaces/IDiscountService";

export class VoucherController {
  constructor(private readonly discountService: IDiscountService) {}

  async getVouchers(req: Request, res: Response): Promise<void> {
    try {
      const vouchers = await this.discountService.getActiveVouchers();
      res.status(200).json({
        success: true,
        data: vouchers
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Internal Server Error"
      });
    }
  }

  async getVoucherByCode(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const voucher = await this.discountService.getVoucherByCode(code as string);
      if (!voucher) {
        res.status(404).json({ success: false, message: "Mã giảm giá không tồn tại" });
        return;
      }
      res.status(200).json({ success: true, data: voucher });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
