import { prisma } from "../config/prisma";
import { IPurchaseRepository } from "../interfaces/IPurchaseRepository";

export class PurchaseRepository implements IPurchaseRepository {
  async getPurchaseOrders(skip: number, take: number): Promise<[any[], number]> {
    return Promise.all([
      prisma.purchaseOrder.findMany({
        skip,
        take,
        include: { brand: true },
        orderBy: { createdAt: "desc" }
      }),
      prisma.purchaseOrder.count()
    ]);
  }

  async getPurchaseOrderById(id: string) {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: { 
        brand: true,
        items: true
      }
    });

    if (!po) return null;

    const variantIds = po.items.map(i => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: true }
    });

    const variantMap = new Map(variants.map(v => [v.id, v]));

    return {
      ...po,
      items: po.items.map(item => ({
        ...item,
        variant: variantMap.get(item.variantId) || null
      }))
    };
  }

  async createPurchaseOrder(poData: any, itemsData: any[]) {
    return prisma.$transaction(async (tx: any) => {
      const count = await tx.purchaseOrder.count();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const code = `PO-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

      const po = await tx.purchaseOrder.create({
        data: {
          code,
          brandId: poData.brandId,
          note: poData.note,
          totalAmount: poData.totalAmount,
          status: "DRAFT"
        }
      });

      if (itemsData && itemsData.length > 0) {
        await tx.purchaseOrderItem.createMany({
          data: itemsData.map(item => ({
            purchaseOrderId: po.id,
            variantId: item.variantId,
            orderedQty: item.orderedQty,
            costPrice: item.costPrice
          }))
        });
      }

      return po;
    });
  }

  async updatePurchaseOrderStatus(id: string, status: string) {
    return prisma.purchaseOrder.update({
      where: { id },
      data: { status }
    });
  }
}
