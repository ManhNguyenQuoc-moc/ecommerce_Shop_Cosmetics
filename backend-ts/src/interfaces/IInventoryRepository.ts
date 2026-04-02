import { Batch, StockTransaction } from "@prisma/client";

export interface IInventoryRepository {
  getBatches(skip: number, take: number, filters?: any): Promise<[any[], number]>;
  getTransactions(skip: number, take: number): Promise<[any[], number]>;
  
  findBatch(variantId: string, batchNumber: string): Promise<Batch | null>;
  receiveStockWithTransaction(poId: string, variantId: string, batchData: any, qty: number, note?: string): Promise<any>;
  
  getStockForVariants(variantIds: string[]): Promise<Record<string, number>>;
}
