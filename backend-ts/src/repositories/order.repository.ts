import { Order, OrderStatus } from "@prisma/client";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { prisma } from "../config/prisma";

export class OrderRepository implements IOrderRepository {
  async findAll(skip?: number, take?: number, filters?: any): Promise<[Order[], number]> {
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

  async create(data: any): Promise<Order> {
    const { items, customer, address, total, ...orderData } = data;

    return prisma.$transaction(async (tx) => {
      let userId = data.userId;

      // 1. Resolve User (Auto-Account Creation)
      if (!userId && customer?.email) {
        const user = await tx.user.upsert({
          where: { email: customer.email },
          update: {
            full_name: customer.name || undefined,
            phone: customer.phone || undefined,
          },
          create: {
            email: customer.email,
            full_name: customer.name || "Guest",
            phone: customer.phone || null,
          },
        });
        userId = user.id;
      } else if (!userId && customer?.phone) {
          // Fallback to phone if email missing but phone exists
          const user = await tx.user.upsert({
            where: { phone: customer.phone },
            update: {
                full_name: customer.name || undefined,
            },
            create: {
                phone: customer.phone,
                full_name: customer.name || "Guest",
            }
          });
          userId = user.id;
      }

      if (!userId) {
        throw new Error("Không thể xác định hoặc tạo người dùng cho đơn hàng này.");
      }

      // 2. Resolve Address
      let addressId = data.addressId;
      if (!addressId && address?.address) {
        const addrRecord = await tx.address.create({
          data: {
            userId,
            address: address.address,
            lat: address.lat || null,
            lon: address.lon || null,
          },
        });
        addressId = addrRecord.id;
      }

      // 3. Create Order
      const order = await tx.order.create({
        data: {
          userId,
          addressId,
          total_amount: total || 0,
          final_amount: total || 0,
          current_status: orderData.current_status || "PENDING",
          payment_method: orderData.payment_method || "COD",
          payment_status: orderData.payment_status || "UNPAID",
          items: {
            create: items.map((item: any) => ({
              variantId: item.variantId,
              quantity: item.quantity,
              price_at_purchase: item.price || item.price_at_purchase || 0,
            })),
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

      // Stock deduction logic (FEFO) - Same as before but robust
      for (const item of order.items) {
        if (!item.variantId) continue;
        
        let remainingToDeduct = item.quantity;
        const now = new Date();
        const minExpiry = new Date();
        minExpiry.setMonth(minExpiry.getMonth() + 3);

        const validBatches = await tx.batch.findMany({
          where: {
            variantId: item.variantId,
            expiryDate: { gt: minExpiry },
            quantity: { gt: 0 }
          },
          orderBy: { expiryDate: 'asc' }
        });

        for (const batch of validBatches) {
          if (remainingToDeduct <= 0) break;

          const deduction = Math.min(batch.quantity, remainingToDeduct);
          
          await tx.batch.update({
            where: { id: batch.id },
            data: { quantity: { decrement: deduction } }
          });

          await tx.stockTransaction.create({
            data: {
              variantId: item.variantId,
              batchId: batch.id,
              type: 'OUT',
              quantity: -deduction,
              referenceId: order.id,
              note: `Checkout order ${order.id}`
            }
          });

          remainingToDeduct -= deduction;
        }

        if (remainingToDeduct > 0) {
          throw new Error(`Sản phẩm [${item.variantId}] không đủ tồn kho hợp lệ (hạn sử dụng > 3 tháng).`);
        }
      }

      if (order.current_status === "CONFIRMED" || order.current_status === "DELIVERED" || order.current_status === "SHIPPING") {
        await this.syncSoldCounts(order.id, "increment", tx);
      }

      return order;
    });
  }

  async update(id: string, data: any): Promise<Order> {
    return prisma.$transaction(async (tx) => {
      const oldOrder = await tx.order.findUnique({
        where: { id },
        select: { 
          current_status: true,
          payment_method: true,
          payment_status: true,
        }
      });

      const updateData = { ...data };

      // COD Automation: If status is DELIVERED and method is COD, mark as PAID
      if (oldOrder?.payment_method === 'COD' && data.current_status === 'DELIVERED') {
        updateData.payment_status = 'PAID';
      }

      const updatedOrder = await tx.order.update({
        where: { id },
        data: updateData,
        include: { items: true }
      });

      if (oldOrder && data.current_status && oldOrder.current_status !== data.current_status) {
        // 1. Create Status History Record
        await tx.orderStatusHistory.create({
          data: {
            orderId: id,
            status: data.current_status as any,
          }
        });

        // 2. Stock Restoration Logic
        if (data.current_status === 'CANCELLED' && oldOrder.current_status !== 'CANCELLED') {
          await this.restoreStock(id, tx);
        }

        // 3. Sync Sold Counts Logic
        const isNowSold = ["CONFIRMED", "SHIPPING", "DELIVERED"].includes(data.current_status);
        const wasSold = ["CONFIRMED", "SHIPPING", "DELIVERED"].includes(oldOrder.current_status);

        if (isNowSold && !wasSold) {
          await this.syncSoldCounts(id, "increment", tx);
        } else if (!isNowSold && wasSold) {
          await this.syncSoldCounts(id, "decrement", tx);
        }
      }

      return updatedOrder;
    });
  }

  private async restoreStock(orderId: string, tx?: any) {
    const db = tx || prisma;
    
    // Find all 'OUT' transactions for this order
    const transactions = await db.stockTransaction.findMany({
      where: {
        referenceId: orderId,
        type: 'OUT'
      }
    });

    for (const st of transactions) {
      if (!st.batchId) continue;
      
      // Increment batch quantity
      await db.batch.update({
        where: { id: st.batchId },
        data: { quantity: { increment: Math.abs(st.quantity) } }
      });

      // Create restoration transaction record
      await db.stockTransaction.create({
        data: {
          variantId: st.variantId,
          batchId: st.batchId,
          type: 'IN',
          quantity: Math.abs(st.quantity),
          referenceId: orderId,
          note: `Hoàn kho từ đơn hàng đã hủy ${orderId}`
        }
      });
    }
  }

  private async syncSoldCounts(orderId: string, action: "increment" | "decrement", tx?: any) {
    const db = tx || prisma;
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true }
    });

    if (!order) return;

    for (const item of order.items) {
      if (!item.variantId) continue;

      const incrementValue = action === "increment" ? item.quantity : -item.quantity;

      // Update Variant sold count
      const variant = await db.productVariant.update({
        where: { id: item.variantId },
        data: {
          sold: { increment: incrementValue }
        },
        select: { productId: true }
      });

      // Update Product sold count
      await db.product.update({
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
