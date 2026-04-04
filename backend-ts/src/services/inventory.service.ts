import { IInventoryRepository } from "../interfaces/IInventoryRepository";
import { InventoryRepository } from "../repositories/inventory.repository";

export class InventoryService {
  constructor(private readonly inventoryRepo: IInventoryRepository = new InventoryRepository()) {}

  async receiveStock(data: {
    poId: string;
    variantId: string;
    batchNumber: string;
    expiryDate: Date;
    manufacturingDate?: Date;
    quantity: number;
    costPrice: number;
    note?: string;
  }) {
    const batchData = {
      batchNumber: data.batchNumber,
      expiryDate: data.expiryDate,
      manufacturingDate: data.manufacturingDate,
      costPrice: data.costPrice
    };
    return this.inventoryRepo.receiveStockWithTransaction(data.poId, data.variantId, batchData, data.quantity, data.note);
  }

  async getBatches(page: number = 1, limit: number = 6, filters?: any) {
    const skip = (page - 1) * limit;
    const [batches, total] = await this.inventoryRepo.getBatches(skip, limit, filters);
    
    const mappedBatches = batches.map((b: any) => {
      const totalIn = b.transactions
        .filter((t: any) => t.type === 'IN')
        .reduce((sum: number, t: any) => sum + t.quantity, 0);
      
      const totalOut = b.transactions
        .filter((t: any) => t.type === 'OUT')
        .reduce((sum: number, t: any) => sum + Math.abs(t.quantity), 0);

      const now = new Date();
      const nearExpiry = new Date();
      nearExpiry.setMonth(nearExpiry.getMonth() + 3);

      let status: 'EXPIRED' | 'NEAR_EXPIRY' | 'GOOD' | 'OUT_OF_STOCK' = 'GOOD';
      if (b.quantity === 0) status = 'OUT_OF_STOCK';
      else if (new Date(b.expiryDate) < now) status = 'EXPIRED';
      else if (new Date(b.expiryDate) <= nearExpiry) status = 'NEAR_EXPIRY';

      return {
        id: b.id,
        batchNumber: b.batchNumber,
        purchaseOrderCode: b.purchaseOrder?.code || null,
        quantity: b.quantity,
        costPrice: b.costPrice,
        expiryDate: b.expiryDate,
        manufacturingDate: b.manufacturingDate,
        totalIn,
        totalOut,
        variantId: b.variantId,
        variant: {
          sku: b.variant.sku,
          color: b.variant.color,
          size: b.variant.size,
          image: b.variant.image?.url || b.variant.product.productImages?.[0]?.image?.url || null,
          product: {
            id: b.variant.product.id,
            name: b.variant.product.name,
            category: b.variant.product.category?.name
          }
        },
        status,
        createdAt: b.createdAt
      };
    });

    return { items: mappedBatches, total, page, limit };
  }

  async getTransactions(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [transactions, total] = await this.inventoryRepo.getTransactions(skip, limit);
    return { transactions, total, page, limit };
  }

  async getStockForVariants(variantIds: string[]) {
    return this.inventoryRepo.getStockForVariants(variantIds);
  }
}
