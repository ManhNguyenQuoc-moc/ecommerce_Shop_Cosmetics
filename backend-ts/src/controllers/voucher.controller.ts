import { Request, Response } from "express";
import { IDiscountService } from "../interfaces/IDiscountService";
import { CreateVoucherSchema, UpdateVoucherSchema } from "../DTO/voucher/voucher.dto";
import { z } from "zod";

export class VoucherController {
  constructor(private readonly discountService: IDiscountService) {}

  async getVouchers(req: Request, res: Response): Promise<void> {
    try {
      const isAll = req.query.all === 'true';
      const userId = (req as any).user?.id;
      const vouchers = isAll 
        ? await this.discountService.getAllVouchers(userId)
        : await this.discountService.getActiveVouchers(userId);
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

  async createVoucher(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = CreateVoucherSchema.parse(req.body);
      const voucher = await this.discountService.createVoucher(validatedData);
      res.status(201).json({ success: true, message: "Tạo voucher thành công", data: voucher });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dữ liệu không hợp lệ", 
          errors: error.issues.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async updateVoucher(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const validatedData = UpdateVoucherSchema.parse(req.body);
      const voucher = await this.discountService.updateVoucher(id as string, validatedData);
      res.status(200).json({ success: true, message: "Cập nhật voucher thành công", data: voucher });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dữ liệu không hợp lệ", 
          errors: error.issues.map(err => ({
            path: err.path.join('.'),
            message: err.message
          }))
        });
        return;
      }
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async deleteVoucher(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.discountService.deleteVoucher(id as string);
      res.status(200).json({ success: true, message: "Xóa voucher thành công" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
