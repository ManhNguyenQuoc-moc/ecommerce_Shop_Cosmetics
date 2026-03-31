import { IPurchaseRepository } from "../interfaces/IPurchaseRepository";
import { PurchaseRepository } from "../repositories/purchase.repository";

export class PurchaseService {
  constructor(private readonly purchaseRepo: IPurchaseRepository = new PurchaseRepository()) {}

  // --- Purchase Orders ---
  async getPurchaseOrders(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [orders, total] = await this.purchaseRepo.getPurchaseOrders(skip, limit);
    return { orders, total, page, limit };
  }

  async getPurchaseOrderById(id: string) {
    return this.purchaseRepo.getPurchaseOrderById(id);
  }

  async createPurchaseOrder(data: { brandId: string; note?: string; items: { variantId: string; orderedQty: number; costPrice: number }[] }) {
    const totalAmount = data.items.reduce((sum, item) => sum + item.orderedQty * item.costPrice, 0);
    return this.purchaseRepo.createPurchaseOrder(
      { brandId: data.brandId, note: data.note, totalAmount }, 
      data.items
    );
  }

  async confirmPurchaseOrder(id: string) {
    const po = await this.purchaseRepo.getPurchaseOrderById(id);
    if (!po) throw new Error("PO not found");
    if (po.status !== "DRAFT") throw new Error("Only DRAFT PO can be confirmed");

    return this.purchaseRepo.updatePurchaseOrderStatus(id, "CONFIRMED");
  }
}
