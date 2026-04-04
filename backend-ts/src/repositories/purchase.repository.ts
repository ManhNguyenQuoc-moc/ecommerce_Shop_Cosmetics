import { PurchaseOrder, Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";
import { IPurchaseRepository } from "../interfaces/IPurchaseRepository";
import { CreatePODTO, POQueryFiltersDTO } from "../DTO/purchase/input/CreatePODTO";
import { UpdatePODTO } from "../DTO/purchase/input/UpdatePODTO";
import { PODetailDTO, POListItemDTO, POStatus, POPriority, POReceiptItemDTO, POItemResponseDTO } from "../DTO/purchase/output/POResponseDTO";

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
        items: {
          take: 50, // Initial load limit for performance
          include: {
            variant: {
              include: {
                product: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!po) return null;

    // Fetch Receipts (Transactions)
    const transactions = await prisma.stockTransaction.findMany({
      where: { referenceId: id, type: 'IN' },
      include: { 
        batch: {
          include: {
            variant: {
              include: {
                product: true,
                image: true,
              }
            }
          }
        } 
      },
      orderBy: { createdAt: 'desc' },
      take: 50, // Initial load limit for performance
    });

    const receipts: POReceiptItemDTO[] = transactions.map((t: any) => ({
      variantId: t.variantId,
      quantity: t.quantity,
      batchNumber: t.batch.batchNumber,
      expiryDate: t.batch.expiryDate.toISOString(),
      manufacturingDate: t.batch.manufacturingDate?.toISOString(),
      createdAt: t.createdAt.toISOString(),
      variant: {
        id: t.batch.variant.id,
        sku: t.batch.variant.sku,
        color: t.batch.variant.color,
        size: t.batch.variant.size,
        image: t.batch.variant.image?.url,
        product: {
          id: t.batch.variant.product.id,
          name: t.batch.variant.product.name,
        }
      }
    }));

    const items: POItemResponseDTO[] = po.items.map((item: any) => ({
      id: item.id,
      purchaseOrderId: item.purchaseOrderId,
      variantId: item.variantId,
      orderedQty: item.orderedQty,
      receivedQty: item.receivedQty,
      costPrice: item.costPrice,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      variant: {
        id: item.variant.id,
        sku: item.variant.sku,
        color: item.variant.color,
        size: item.variant.size,
        image: item.variant.image?.url,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
        }
      }
    }));

    const detail: PODetailDTO = {
      id: po.id,
      code: po.code,
      brandId: po.brandId,
      status: po.status as POStatus,
      priority: po.priority as POPriority,
      totalAmount: po.totalAmount,
      note: po.note,
      brand: {
        id: po.brand.id,
        name: po.brand.name,
        logoUrl: po.brand.logoId, // Adjusted mapping
      },
      items,
      receipts,
      createdAt: po.createdAt.toISOString(),
      updatedAt: po.updatedAt.toISOString(),
    };

    return detail;
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
          priority: data.priority || 'NORMAL',
          totalAmount,
          status: 'DRAFT',
        } as any,
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
          priority: data.priority,
          totalAmount,
        } as any,
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

  async getPurchaseOrderItems(id: string, skip: number, take: number): Promise<[any[], number]> {
    const [items, total] = await Promise.all([
      prisma.purchaseOrderItem.findMany({
        where: { purchaseOrderId: id },
        skip,
        take,
        include: {
          variant: {
            include: {
              product: true,
              image: true,
            },
          },
        },
      }),
      prisma.purchaseOrderItem.count({ where: { purchaseOrderId: id } }),
    ]);

    const mappedItems = items.map((item: any) => ({
      id: item.id,
      purchaseOrderId: item.purchaseOrderId,
      variantId: item.variantId,
      orderedQty: item.orderedQty,
      receivedQty: item.receivedQty,
      costPrice: item.costPrice,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
      variant: {
        id: item.variant.id,
        sku: item.variant.sku,
        color: item.variant.color,
        size: item.variant.size,
        image: item.variant.image?.url,
        product: {
          id: item.variant.product.id,
          name: item.variant.product.name,
        }
      }
    }));

    return [mappedItems, total];
  }

  async getPurchaseOrderReceipts(id: string, skip: number, take: number): Promise<[any[], number]> {
    const [transactions, total] = await Promise.all([
      prisma.stockTransaction.findMany({
        where: { referenceId: id, type: 'IN' },
        include: { 
          batch: {
            include: {
              variant: {
                include: {
                  product: true,
                  image: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.stockTransaction.count({ where: { referenceId: id, type: 'IN' } }),
    ]);

    const receipts = transactions.map((t: any) => ({
      variantId: t.variantId,
      quantity: t.quantity,
      batchNumber: t.batch.batchNumber,
      manufacturingDate: t.batch.manufacturingDate?.toISOString(),
      expiryDate: t.batch.expiryDate.toISOString(),
      createdAt: t.createdAt.toISOString(),
      variant: {
        id: t.batch.variant.id,
        sku: t.batch.variant.sku,
        color: t.batch.variant.color,
        size: t.batch.variant.size,
        image: t.batch.variant.image?.url,
        product: {
          id: t.batch.variant.product.id,
          name: t.batch.variant.product.name,
        }
      }
    }));

    return [receipts, total];
  }

  async updatePurchaseOrderStatus(id: string, status: POStatus): Promise<PurchaseOrder> {
    return prisma.purchaseOrder.update({
      where: { id },
      data: { status },
    });
  }
}
