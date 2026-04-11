import { Order, Prisma } from "@prisma/client";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { prisma } from "../config/prisma";
import { CreateOrderDTO, OrderQueryFiltersDTO, UpdateOrderDTO } from "../DTO/order/order.dto";

export class OrderRepository implements IOrderRepository {
  async findAll(skip?: number, take?: number, filters?: OrderQueryFiltersDTO): Promise<[Order[], number]> {
    const where: any = {};

    if (filters?.searchTerm) {
      where.OR = [
        { id: { contains: filters.searchTerm, mode: 'insensitive' } },
        { user: { full_name: { contains: filters.searchTerm, mode: 'insensitive' } } },
        { user: { email: { contains: filters.searchTerm, mode: 'insensitive' } } },
        { user: { phone: { contains: filters.searchTerm, mode: 'insensitive' } } },
      ];
    }

    if (filters?.status && filters.status !== 'ALL') {
      where.current_status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = new Date(filters.startDate);
      if (filters.endDate) where.createdAt.lte = new Date(filters.endDate);
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true,
                  image: true
                }
              }
            }
          },
          user: true,
          address: true,
          status_history: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where })
    ]);
    return [orders, total];
  }

  async findById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true,
                image: true
              }
            }
          }
        },
        user: true,
        address: true,
        status_history: true,
      },
    });
  }

  async findWithItems(id: string, tx?: Prisma.TransactionClient): Promise<Order & { items: any[] } | null> {
    const db = tx || prisma;
    return db.order.findUnique({
      where: { id },
      include: { items: true }
    }) as any;
  }

  async create(data: CreateOrderDTO & { userId: string, addressId?: string }, tx?: Prisma.TransactionClient): Promise<Order> {
    const db = tx || prisma;
    const { items, total, shipping_fee, shipping_method, paymentMethod, userId, addressId } = data;

    return db.order.create({
      data: {
        userId,
        addressId,
        total_amount: total || 0,
        shipping_fee: shipping_fee || 0,
        shipping_method: shipping_method || null,
        final_amount: (total || 0) + (shipping_fee || 0),
        current_status: "PENDING",
        payment_method: paymentMethod as any,
        payment_status: "UNPAID",
        items: {
          create: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price_at_purchase: item.price || 0,
          })),
        },
        status_history: {
          create: {
            status: "PENDING",
          },
        },
      },
      include: { items: true },
    });
  }

  async update(id: string, data: UpdateOrderDTO, tx?: Prisma.TransactionClient): Promise<Order> {
    const db = tx || prisma;
    
    const updatedOrder = await db.order.update({
      where: { id },
      data: data as any,
      include: { items: true }
    });

    if (data.current_status) {
      await db.orderStatusHistory.create({
        data: {
          orderId: id,
          status: data.current_status,
        }
      });
    }

    return updatedOrder;
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    });
  }
}