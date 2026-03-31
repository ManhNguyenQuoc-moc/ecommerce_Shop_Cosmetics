import { prisma } from "../config/prisma";
import { IInventoryRepository } from "../interfaces/IInventoryRepository";

export class InventoryRepository implements IInventoryRepository {
  async getBatches(skip: number, take: number): Promise<[any[], number]> {
    return Promise.all([
      prisma.batch.findMany({
        skip,
        take,
        orderBy: { expiryDate: "asc" }
      }),
      prisma.batch.count()
    ]);
  }

  async getTransactions(skip: number, take: number): Promise<[any[], number]> {
    return Promise.all([
      prisma.stockTransaction.findMany({
        skip,
        take,
        include: { batch: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.stockTransaction.count()
    ]);
  }

  async findBatch(variantId: string, batchNumber: string) {
    return prisma.batch.findUnique({
      where: { variantId_batchNumber: { variantId, batchNumber } }
    });
  }

  async receiveStockWithTransaction(poId: string, variantId: string, batchData: any, quantity: number, note?: string) {
    return prisma.$transaction(async (tx: any) => {
      const po = await tx.purchaseOrder.findUnique({ where: { id: poId }, include: { items: true } });
      if (!po) throw new Error("PO not found");
      if (po.status !== "CONFIRMED" && po.status !== "PARTIALLY_RECEIVED") {
        throw new Error("PO must be CONFIRMED to receive stock");
      }

      const poItem = po.items.find((i: any) => i.variantId === variantId);
      if (!poItem) throw new Error("Variant not in PO");
      if (poItem.receivedQty + quantity > poItem.orderedQty) {
        throw new Error("Cannot receive more than ordered");
      }

      let batch = await tx.batch.findUnique({
        where: { variantId_batchNumber: { variantId, batchNumber: batchData.batchNumber } }
      });

      if (!batch) {
        batch = await tx.batch.create({
          data: {
            variantId: variantId,
            batchNumber: batchData.batchNumber,
            expiryDate: batchData.expiryDate,
            manufacturingDate: batchData.manufacturingDate || null,
            quantity: quantity,
            costPrice: batchData.costPrice
          }
        });
      } else {
        batch = await tx.batch.update({
          where: { id: batch.id },
          data: { quantity: batch.quantity + quantity }
        });
      }

      await tx.stockTransaction.create({
        data: {
          variantId,
          batchId: batch.id,
          type: "IN",
          quantity,
          referenceId: po.id,
          note: note || "Receive from PO"
        }
      });

      const updatedPoItem = await tx.purchaseOrderItem.update({
        where: { id: poItem.id },
        data: { receivedQty: poItem.receivedQty + quantity }
      });

      const allItems = await tx.purchaseOrderItem.findMany({ where: { purchaseOrderId: po.id } });
      const isCompleted = allItems.every((i: any) => i.receivedQty >= i.orderedQty);
      
      await tx.purchaseOrder.update({
        where: { id: po.id },
        data: { status: isCompleted ? "COMPLETED" : "PARTIALLY_RECEIVED" }
      });

      return { batch, poItem: updatedPoItem };
    });
  }

  async getStockForVariants(variantIds: string[]) {
    const batches = await prisma.batch.findMany({
      where: { variantId: { in: variantIds } }
    });
    const stockMap: Record<string, number> = {};
    for (const b of batches) {
      if (!stockMap[b.variantId]) stockMap[b.variantId] = 0;
      stockMap[b.variantId] += b.quantity;
    }
    return stockMap;
  }
}
