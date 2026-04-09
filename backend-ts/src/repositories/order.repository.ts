import { Order, OrderStatus } from "@prisma/client";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { prisma } from "../config/prisma";

export class OrderRepository implements IOrderRepository {
  async findAll(skip?: number, take?: number): Promise<[Order[], number]> {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take,
        include: {
          items: {
            include: {
              variant: {
                include: {
                  product: true
                }
              }
            }
          },
          user: true,
          status_history: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where: {} }) // Note: Usually we should have filters here too
    ]);
    return [orders, total];
  }

  async findById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: true,
        status_history: true,
      },
    });
  }

  async create(data: any): Promise<Order> {
    const { items, ...orderData } = data;

    const order = await prisma.order.create({
      data: {
        ...orderData,
        items: {
          create: items,
        },
        status_history: {
          create: {
            status: orderData.current_status || "PENDING",
          },
        },
      },
      include: {
        items: true,
      },
    });

    if (order.current_status === "CONFIRMED" || order.current_status === "DELIVERED" || order.current_status === "SHIPPING") {
      await this.syncSoldCounts(order.id, "increment");
    }

    return order;
  }

  async update(id: string, data: any): Promise<Order> {
    const oldOrder = await prisma.order.findUnique({
      where: { id },
      select: { current_status: true }
    });

    const updatedOrder = await prisma.order.update({
      where: { id },
      data,
      include: { items: true }
    });

    if (oldOrder && data.current_status && oldOrder.current_status !== data.current_status) {
      const isNowSold = ["CONFIRMED", "SHIPPING", "DELIVERED"].includes(data.current_status);
      const wasSold = ["CONFIRMED", "SHIPPING", "DELIVERED"].includes(oldOrder.current_status);

      if (isNowSold && !wasSold) {
        await this.syncSoldCounts(id, "increment");
      } else if (!isNowSold && wasSold) {
        await this.syncSoldCounts(id, "decrement");
      }
    }

    return updatedOrder;
  }

  private async syncSoldCounts(orderId: string, action: "increment" | "decrement") {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return;

    for (const item of order.items) {
      if (!item.variantId) continue;

      const incrementValue = action === "increment" ? item.quantity : -item.quantity;

      // Update Variant sold count
      const variant = await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          sold: { increment: incrementValue }
        },
        select: { productId: true }
      });

      // Update Product sold count
      await prisma.product.update({
        where: { id: variant.productId },
        data: {
          sold: { increment: incrementValue }
        }
      });
    }
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    });
  }
}
