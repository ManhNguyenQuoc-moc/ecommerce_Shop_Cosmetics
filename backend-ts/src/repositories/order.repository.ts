import { Order } from "@prisma/client";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { prisma } from "../config/prisma";

export class OrderRepository implements IOrderRepository {
  async findAll(): Promise<Order[]> {
    return prisma.order.findMany({
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
    });
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
    
    return prisma.order.create({
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
  }

  async update(id: string, data: any): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.order.delete({
      where: { id },
    });
  }
}
