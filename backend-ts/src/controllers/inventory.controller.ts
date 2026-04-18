import { Request, Response } from "express";
import { InventoryService } from "../services/inventory.service";
import { InventoryRepository } from "../repositories/inventory.repository";

import { NotificationService } from "../services/notification.service";
import { NotificationRepository } from "../repositories/notification.repository";

const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository);
const inventoryRepository = new InventoryRepository();
const inventoryService = new InventoryService(inventoryRepository, notificationService);

export class InventoryController {
  
  async receiveStock(req: Request, res: Response) {
    try {
      const { poId, variantId, batchNumber, expiryDate, manufacturingDate, quantity, costPrice, note } = req.body;
      const result = await inventoryService.receiveStock({
        poId,
        variantId,
        batchNumber,
        expiryDate: new Date(expiryDate),
        manufacturingDate: manufacturingDate ? new Date(manufacturingDate) : undefined,
        quantity: Number(quantity),
        costPrice: Number(costPrice),
        note
      });
      res.json({ success: true, data: result, message: "Nhập kho thành công" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getBatches(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || parseInt(req.query.limit as string) || 6;
      const filters = {
        search: req.query.search as string,
        categoryId: req.query.categoryId as string,
        status: req.query.status as any,
        sortBy: req.query.sortBy as any,
        mfgDateFrom: req.query.mfgDateFrom as string,
        mfgDateTo: req.query.mfgDateTo as string,
        expiryDateFrom: req.query.expiryDateFrom as string,
        expiryDateTo: req.query.expiryDateTo as string
      };
      
      const result = await inventoryService.getBatches(page, pageSize, filters);
      res.json({ 
        success: true, 
        data: result 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async getTransactions(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const result = await inventoryService.getTransactions(page, limit);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Import mock
  async importExcel(req: Request, res: Response) {
    try {
      // Stub for excel logic
      res.json({ success: true, message: "Import excel route called" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
