import { Order, OrderStatus } from "@prisma/client";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { IOrderService } from "../interfaces/IOrderService";
import { OrderMapper } from "../mappers/order.mapper";
import { CreateOrderDTO, OrderQueryFiltersDTO, UpdateOrderDTO } from "../DTO/order/order.dto";
import { IUserService } from "../interfaces/IUserService";
import { IInventoryRepository } from "../interfaces/IInventoryRepository";
import { MailService } from "./mail.service";
import { prisma } from "../config/prisma";

export class OrderService implements IOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly userService: IUserService,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly mailService: MailService
  ) {}

  async getOrders(page?: number, pageSize?: number, filters?: OrderQueryFiltersDTO): Promise<{ items: any[], total: number }> {
    const skip = page && pageSize ? (page - 1) * pageSize : undefined;
    const take = pageSize || undefined;
    const [items, total] = await this.orderRepository.findAll(skip, take, filters);
    
    const mappedItems = items.map(item => OrderMapper.toDto(item));
    
    return { items: mappedItems, total };
  }

  async getOrderById(id: string): Promise<any | null> {
    const order = await this.orderRepository.findById(id);
    return OrderMapper.toDto(order);
  }

  async createOrder(data: CreateOrderDTO): Promise<Order> {
    return await prisma.$transaction(async (tx: any) => {
      // 1. Resolve User
      let userId = data.userId;
      let rawPassword: string | undefined;

      if (!userId && data.customer) {
        const result = await this.userService.getOrCreateCustomer(data.customer, tx);
        userId = result.user.id;
        rawPassword = result.rawPassword;
      }

      if (!userId) {
        throw new Error("User information is required for checkout.");
      }

      // 2. Resolve Address (if new)
      let addressId = (data.address as any)?.addressId;
      if (!addressId && data.address?.address) {
        // We could move this to an AddressRepository, but for brevity keep it simple or use UserRepo
        const addrRecord = await tx.address.create({
          data: {
            userId,
            address: data.address.address,
            lat: data.address.lat || null,
            lon: data.address.lon || null,
          },
        });
        addressId = addrRecord.id;
      }

      // 3. Create Order
      const order = await this.orderRepository.create({ ...data, userId, addressId }, tx);

      // 4. Deduct Stock (FEFO)
      for (const item of data.items) {
        await this.inventoryRepository.deductStock(item.variantId, item.quantity, order.id, tx);
      }

      // 5. Send Email (Non-blocking, after transaction)
      if (data.customer?.email) {
        this.mailService.sendOrderConfirmation(data.customer.email, order, rawPassword).catch(console.error);
      } else if (userId) {
        const user = await this.userService.getUserById(userId);
        if (user?.email) {
          this.mailService.sendOrderConfirmation(user.email, order, rawPassword).catch(console.error);
        }
      }

      return order;
    });
  }

  async updateOrder(id: string, data: UpdateOrderDTO): Promise<Order> {
    return await prisma.$transaction(async (tx: any) => {
      const oldOrder = await this.orderRepository.findWithItems(id, tx);
      if (!oldOrder) throw new Error("Order not found");

      // Automation logic
      if (oldOrder.payment_method === 'COD' && data.current_status === 'DELIVERED') {
        data.payment_status = 'PAID';
      }

      const updatedOrder = await this.orderRepository.update(id, data, tx);

      // Status transition logic
      if (data.current_status && oldOrder.current_status !== data.current_status) {
        // Stock Restoration
        if (data.current_status === 'CANCELLED' && oldOrder.current_status !== 'CANCELLED') {
          await this.inventoryRepository.restoreStock(id, tx);
        }

        // Sync Sold Counts (Could be in a ProductService)
        await this.syncSoldCounts(id, oldOrder.current_status, data.current_status, tx);
      }

      return updatedOrder;
    });
  }

  private async syncSoldCounts(orderId: string, oldStatus: OrderStatus, newStatus: OrderStatus, tx: any) {
    const isNowSold = ["CONFIRMED", "SHIPPING", "DELIVERED"].includes(newStatus);
    const wasSold = ["CONFIRMED", "SHIPPING", "DELIVERED"].includes(oldStatus);

    if (isNowSold === wasSold) return;

    const order = await this.orderRepository.findWithItems(orderId, tx);
    if (!order) return;

    const incrementValue = isNowSold ? 1 : -1;

    for (const item of order.items) {
      if (!item.variantId) continue;

      const qty = item.quantity * incrementValue;

      const variant = await tx.productVariant.update({
        where: { id: item.variantId },
        data: { sold: { increment: qty } },
        select: { productId: true }
      });

      await tx.product.update({
        where: { id: variant.productId },
        data: { sold: { increment: qty } }
      });
    }
  }

  async deleteOrder(id: string): Promise<void> {
    return this.orderRepository.delete(id);
  }
}
