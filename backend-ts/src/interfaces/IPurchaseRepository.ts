import { PurchaseOrder, PurchaseOrderItem } from "@prisma/client";

export interface IPurchaseRepository {
  
  getPurchaseOrders(skip: number, take: number): Promise<[any[], number]>;
  getPurchaseOrderById(id: string): Promise<any | null>;
  
  createPurchaseOrder(data: any, items: any[]): Promise<PurchaseOrder>;
  updatePurchaseOrderStatus(id: string, status: string): Promise<PurchaseOrder>;
}
