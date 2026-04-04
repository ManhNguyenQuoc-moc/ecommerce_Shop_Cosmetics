import { Request, Response } from "express";
import { PurchaseService } from "../services/purchase.service";
import { CreatePODTO, POQueryFiltersDTO } from "../DTO/purchase/input/CreatePODTO";
import { UpdatePODTO } from "../DTO/purchase/input/UpdatePODTO";
import { ReceiveStockDTO } from "../DTO/purchase/input/ReceiveStockDTO";

const purchaseService = new PurchaseService();

export class PurchaseController {

  async getPOs(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 6;

      const filters: POQueryFiltersDTO = {
        search: req.query.search as string | undefined,
        status: req.query.status as string | undefined,
        brandId: req.query.brandId as string | undefined,
        sortBy: req.query.sortBy as POQueryFiltersDTO['sortBy'],
      };

      const result = await purchaseService.getPurchaseOrders(page, limit, filters);
      res.json({ success: true, data: result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      res.status(500).json({ success: false, message });
    }
  }

  async getPOItems(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await purchaseService.getPurchaseOrderItems(id, page, limit);
      res.json({ success: true, data: result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      res.status(500).json({ success: false, message });
    }
  }

  async getPOReceipts(req: Request, res: Response) {
    try {
      const id = req.params.id as string;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await purchaseService.getPurchaseOrderReceipts(id, page, limit);
      res.json({ success: true, data: result });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      res.status(500).json({ success: false, message });
    }
  }

  async getPOById(req: Request, res: Response) {
    try {
      const po = await purchaseService.getPurchaseOrderById(req.params.id as string);
      if (!po) return res.status(404).json({ success: false, message: "Không tìm thấy phiếu nhập" });
      res.json({ success: true, data: po });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      res.status(500).json({ success: false, message });
    }
  }

  async createPO(req: Request, res: Response) {
    try {
      const dto = req.body as CreatePODTO;
      const po = await purchaseService.createPurchaseOrder(dto);
      res.status(201).json({ success: true, data: po, message: "Tạo phiếu nhập thành công" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      res.status(400).json({ success: false, message });
    }
  }

  async updatePO(req: Request, res: Response) {
    try {
      const dto = req.body as UpdatePODTO;
      const po = await purchaseService.updatePurchaseOrder(req.params.id as string, dto);
      res.json({ success: true, data: po, message: "Cập nhật phiếu nhập thành công" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      res.status(400).json({ success: false, message });
    }
  }

  async confirmPO(req: Request, res: Response) {
    try {
      const po = await purchaseService.confirmPurchaseOrder(req.params.id as string);
      res.json({ success: true, data: po, message: "Phiếu nhập đã được duyệt" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      res.status(400).json({ success: false, message });
    }
  }

  async cancelPO(req: Request, res: Response) {
    try {
      const po = await purchaseService.cancelPurchaseOrder(req.params.id as string);
      res.json({ success: true, data: po, message: "Phiếu nhập đã bị hủy" });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      res.status(400).json({ success: false, message });
    }
  }

  async receiveStock(req: Request, res: Response) {
    try {
      const dto = req.body as ReceiveStockDTO;
      if (!dto.poId || !dto.items || dto.items.length === 0) {
        return res.status(400).json({ success: false, message: "Thiếu thông tin nhập kho" });
      }
      const results = await purchaseService.receiveStock(dto);
      res.json({ success: true, data: results, message: `Đã nhập kho ${results.length} mặt hàng thành công` });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Lỗi hệ thống";
      res.status(400).json({ success: false, message });
    }
  }
}
