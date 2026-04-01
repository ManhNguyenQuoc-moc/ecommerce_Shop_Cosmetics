import { PurchaseOrder, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { IPurchaseRepository } from "../interfaces/IPurchaseRepository";
import { CreatePODTO, POQueryFiltersDTO } from "../DTO/purchase/input/CreatePODTO";
import { UpdatePODTO } from "../DTO/purchase/input/UpdatePODTO";
import { PODetailDTO, POListItemDTO, POStatus } from "../DTO/purchase/output/POResponseDTO";

export class PurchaseRepository implements IPurchaseRepository {

  async getPurchaseOrders(
    skip: number,
    take: number,
    filters?: POQueryFiltersDTO
  ): Promise<[POListItemDTO[], number]> {

    const where: Prisma.PurchaseOrderWhereInput = {};

    if (filters?.status && filters.status !== 'all') {
      where.status = filters.status as POStatus;
    }

    if (filters?.brandId && filters.brandId !== 'all') {
      where.brandId = filters.brandId;
    }

    if (filters?.search) {
      where.OR = [
        { code: { contains: filters.search, mode: 'insensitive' } },
        { brand: { name: { contains: filters.search, mode: 'insensitive' } } },
      ];
    }

    let orderBy: Prisma.PurchaseOrderOrderByWithRelationInput = { createdAt: 'desc' };
    if (filters?.sortBy === 'oldest') orderBy = { createdAt: 'asc' };
    else if (filters?.sortBy === 'total_asc') orderBy = { totalAmount: 'asc' };
    else if (filters?.sortBy === 'total_desc') orderBy = { totalAmount: 'desc' };

    const [orders, total] = await Promise.all([
      prisma.purchaseOrder.findMany({
        skip,
        take,
        where,
        include: { brand: true },
        orderBy,
      }),
      prisma.purchaseOrder.count({ where }),
    ]);

    return [orders as unknown as POListItemDTO[], total];
  }

  async getPurchaseOrderById(id: string): Promise<PODetailDTO | null> {
    const po = await prisma.purchaseOrder.findUnique({
      where: { id },
      include: {
        brand: true,
        items: true,
      },
    });

    if (!po) return null;

    const variantIds = po.items.map((i) => i.variantId);
    const variants = await prisma.productVariant.findMany({
      where: { id: { in: variantIds } },
      include: { product: { select: { id: true, name: true } } },
    });

    const variantMap = new Map(variants.map((v) => [v.id, v]));

    return {
      ...po,
      status: po.status as POStatus,
      createdAt: po.createdAt.toISOString(),
      updatedAt: po.updatedAt.toISOString(),
      brand: {
        id: po.brand.id,
        name: po.brand.name,
      },
      items: po.items.map((item) => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
        variant: variantMap.get(item.variantId) ?? null,
      })),
    } as PODetailDTO;
  }

  async createPurchaseOrder(data: CreatePODTO): Promise<PurchaseOrder> {
    return prisma.$transaction(async (tx) => {
      const count = await tx.purchaseOrder.count();
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const code = `PO-${dateStr}-${(count + 1).toString().padStart(4, '0')}`;

      const totalAmount = data.items.reduce(
        (sum, item) => sum + item.orderedQty * item.costPrice,
        0
      );

      const po = await tx.purchaseOrder.create({
        data: {
          code,
          brandId: data.brandId,
          note: data.note,
          totalAmount,
          status: 'DRAFT',
        },
      });

      if (data.items && data.items.length > 0) {
        await tx.purchaseOrderItem.createMany({
          data: data.items.map((item) => ({
            purchaseOrderId: po.id,
            variantId: item.variantId,
            orderedQty: item.orderedQty,
            costPrice: item.costPrice,
          })),
        });
      }

      return po;
    });
  }

  async updatePurchaseOrder(id: string, data: UpdatePODTO): Promise<PurchaseOrder> {
    return prisma.$transaction(async (tx) => {
      // Calculate new total amount
      const totalAmount = data.items.reduce(
        (sum, item) => sum + item.orderedQty * item.costPrice,
        0
      );

      // Update purchase order
      const po = await tx.purchaseOrder.update({
        where: { id },
        data: {
          brandId: data.brandId,
          note: data.note,
          totalAmount,
        },
      });

      // Delete existing items
      await tx.purchaseOrderItem.deleteMany({
        where: { purchaseOrderId: id },
      });

      // Create new items
      if (data.items && data.items.length > 0) {
        await tx.purchaseOrderItem.createMany({
          data: data.items.map((item) => ({
            purchaseOrderId: po.id,
            variantId: item.variantId,
            orderedQty: item.orderedQty,
            costPrice: item.costPrice,
          })),
        });
      }

      return po;
    });
  }

  async updatePurchaseOrderStatus(id: string, status: POStatus): Promise<PurchaseOrder> {
    return prisma.purchaseOrder.update({
      where: { id },
      data: { status },
    });
  }
}
