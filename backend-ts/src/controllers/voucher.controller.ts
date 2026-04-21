import { Request, Response } from "express";
import { IDiscountService } from "../interfaces/IDiscountService";
import { CreateVoucherSchema, UpdateVoucherSchema, VoucherQueryFiltersSchema } from "../DTO/voucher/voucher.dto";
import { z } from "zod";

export class VoucherController {
  constructor(private readonly discountService: IDiscountService) {}

  async getVouchers(req: Request, res: Response): Promise<void> {
    try {
      const query = VoucherQueryFiltersSchema.parse({
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
        type: req.query.type as string | undefined,
        redeemType: req.query.redeemType as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        page: req.query.page ? parseInt(req.query.page as string) : 1,
        pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string) : 6,
        limit: req.query.limit ? parseInt(req.query.limit as string) : (req.query.pageSize ? parseInt(req.query.pageSize as string) : undefined),
      });

      const page = query.page || 1;
      const pageSize = query.limit || query.pageSize || 6;
      const skip = (page - 1) * pageSize;

      const includeExpired = req.query.includeExpired === 'true';
      const userId = (req as any).user?.id;
      const result = includeExpired 
        ? await this.discountService.getAllVouchers(userId, skip, pageSize, query)
        : await this.discountService.getActiveVouchers(userId, skip, pageSize, query);

      res.status(200).json({
        success: true,
        data: {
          data: result.items,
          total: result.total,
          page,
          pageSize,
        }
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
      const userId = (req as any).user?.id; // Get userId from authenticated user
      const voucher = await this.discountService.getVoucherByCode(code as string, userId);
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
