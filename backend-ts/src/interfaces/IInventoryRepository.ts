import { Batch, Prisma, StockTransaction } from "@prisma/client";
import { InventoryQueryFiltersDTO } from "../DTO/inventory/inventory.dto";

export interface IInventoryRepository {
  getBatches(skip: number, take: number, filters?: InventoryQueryFiltersDTO): Promise<[any[], number]>;
  getTransactions(skip: number, take: number): Promise<[any[], number]>;
  
  findBatch(variantId: string, batchNumber: string): Promise<Batch | null>;
  receiveStockWithTransaction(poId: string, variantId: string, batchData: any, qty: number, note?: string): Promise<any>;
  
  getStockForVariants(variantIds: string[]): Promise<Record<string, { totalStock: number, availableStock: number }>>;

  // Stock Management for Orders
  deductStock(variantId: string, quantity: number, orderId: string, tx: Prisma.TransactionClient): Promise<void>;
  restoreStock(orderId: string, tx: Prisma.TransactionClient): Promise<void>;
}
