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

  async getBatches(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    const [batches, total] = await this.inventoryRepo.getBatches(skip, limit);
    return { batches, total, page, limit };
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
