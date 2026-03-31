import { Request, Response } from "express";
import { PurchaseService } from "../services/purchase.service";

const purchaseService = new PurchaseService();

export class PurchaseController {
  
  async getPOs(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await purchaseService.getPurchaseOrders(page, limit);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getPOById(req: Request, res: Response) {
    try {
      const po = await purchaseService.getPurchaseOrderById(req.params.id);
      if (!po) return res.status(404).json({ success: false, message: "Not found" });
      res.json({ success: true, data: po });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async createPO(req: Request, res: Response) {
    try {
      const po = await purchaseService.createPurchaseOrder(req.body);
      res.json({ success: true, data: po, message: "Purchase Order created" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async confirmPO(req: Request, res: Response) {
    try {
      const po = await purchaseService.confirmPurchaseOrder(req.params.id);
      res.json({ success: true, data: po, message: "Purchase Order confirmed" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
