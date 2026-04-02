import { prisma } from "../config/prisma";
import { IInventoryRepository } from "../interfaces/IInventoryRepository";
import { ReceiveStockItemDTO } from "../DTO/purchase/input/ReceiveStockDTO";

export class InventoryRepository implements IInventoryRepository {
  async getBatches(skip: number, take: number, filters?: any): Promise<[any[], number]> {
    const where: any = {};
    
    if (filters?.search) {
      where.OR = [
        { batchNumber: { contains: filters.search, mode: 'insensitive' } },
        { variant: { sku: { contains: filters.search, mode: 'insensitive' } } },
        { variant: { product: { name: { contains: filters.search, mode: 'insensitive' } } } }
      ];
    }

    if (filters?.categoryId && filters.categoryId !== 'all') {
      where.variant = { product: { categoryId: filters.categoryId } };
    }

    if (filters?.status && filters.status !== 'all') {
      const now = new Date();
      const nearExpiry = new Date();
      nearExpiry.setMonth(nearExpiry.getMonth() + 3);

      if (filters.status === 'EXPIRED') {
        where.expiryDate = { lt: now };
      } else if (filters.status === 'NEAR_EXPIRY') {
        where.expiryDate = { gte: now, lte: nearExpiry };
      } else if (filters.status === 'OUT_OF_STOCK') {
        where.quantity = 0;
      } else if (filters.status === 'GOOD') {
        where.expiryDate = { gt: nearExpiry };
        where.quantity = { gt: 0 };
      }
    }

    const orderBy: any = {};
    if (filters?.sortBy === 'expiry_asc') orderBy.expiryDate = 'asc';
    else if (filters?.sortBy === 'expiry_desc') orderBy.expiryDate = 'desc';
    else if (filters?.sortBy === 'qty_asc') orderBy.quantity = 'asc';
    else if (filters?.sortBy === 'qty_desc') orderBy.quantity = 'desc';
    else orderBy.createdAt = 'desc';

    return Promise.all([
      prisma.batch.findMany({
        where,
        skip,
        take,
        include: {
          variant: {
            include: {
              product: {
                include: {
                  category: true
                }
              },
              image: true
            }
          },
          transactions: true
        },
        orderBy
      }),
      prisma.batch.count({ where })
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

  async receiveStockWithTransaction(poId: string, variantId: string, batchData: ReceiveStockItemDTO, quantity: number, note?: string) {
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
