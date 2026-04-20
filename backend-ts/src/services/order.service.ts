import { Order, OrderStatus } from "@prisma/client";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { IOrderService } from "../interfaces/IOrderService";
import { OrderMapper } from "../mappers/order.mapper";
import { CreateOrderDTO, OrderQueryFiltersDTO, UpdateOrderDTO } from "../DTO/order/order.dto";
import { UserService as IUserService } from "../interfaces/IUserService";
import { IInventoryRepository } from "../interfaces/IInventoryRepository";
import { MailService } from "./mail.service";
import { prisma } from "../config/prisma";
import { SettingService } from "./setting.service";

import { NotificationService } from "./notification.service";
import { NotificationType } from "@prisma/client";

export class OrderService implements IOrderService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly userService: IUserService,
    private readonly inventoryRepository: IInventoryRepository,
    private readonly mailService: MailService,
    private readonly settingService: SettingService,
    private readonly notificationService: NotificationService
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

      // 3. Calculate Discount and Deduct Points if DiscountCode exists
      let subtotal = data.items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
      let discountAmount = 0;

      if (data.discountCodeId) {
        const discountCode = await tx.discountCode.findUnique({ where: { id: data.discountCodeId } });
        if (!discountCode || !discountCode.isActive) {
           throw new Error("Mã giảm giá không tồn tại hoặc đã bị vô hiệu hóa.");
        }
        
        const now = new Date();
        if (discountCode.valid_from > now || discountCode.valid_until < now) {
           throw new Error("Mã giảm giá đã hết hạn hoặc chưa đến thời gian sử dụng.");
        }

        // Check if user has already used this voucher
        const existingOrder = await tx.order.findFirst({
          where: {
            userId,
            discountCodeId: discountCode.id,
            current_status: { not: 'CANCELLED' }
          }
        });

        if (existingOrder) {
          throw new Error("Bạn đã sử dụng mã giảm giá này cho một đơn hàng khác rồi.");
        }

        if (discountCode.usage_limit <= discountCode.used_count) {
           throw new Error("Mã giảm giá đã hết lượt sử dụng.");
        }

        if (subtotal < discountCode.min_order_value) {
           throw new Error(`Đơn hàng tối thiểu để sử dụng mã này là ${discountCode.min_order_value.toLocaleString()}đ`);
        }

        // Calculate discount
        if (discountCode.type === 'PERCENTAGE') {
          discountAmount = (subtotal * discountCode.discount) / 100;
          if (discountCode.max_discount && discountAmount > discountCode.max_discount) {
            discountAmount = discountCode.max_discount;
          }
        } else {
          discountAmount = discountCode.discount;
        }

        // 3a. Deduct Points if required
        if (discountCode.point_cost > 0) {
          const userObj = await tx.user.findUnique({ where: { id: userId } });
          if (!userObj) throw new Error("User doesn't exist");
          if (userObj.is_point_wallet_locked) throw new Error("Ví điểm của bạn đã bị khóa.");
          if (userObj.loyalty_points < discountCode.point_cost) throw new Error("Không đủ điểm để đổi mã giảm giá này.");
          
          await tx.user.update({
            where: { id: userId },
            data: { loyalty_points: { decrement: discountCode.point_cost } }
          });
          
          await tx.pointTransaction.create({
            data: { userId, amount: discountCode.point_cost, reason: `Đổi mã giảm giá ${discountCode.code}`, type: "SPEND" }
          });
        }
        // Update usage of voucher
        await tx.discountCode.update({ where: { id: discountCode.id }, data: { used_count: { increment: 1 } } });
      }

      const shippingFee = data.shipping_fee ?? data.shippingFee ?? 0;
      const finalAmount = Math.max(0, subtotal - discountAmount) + shippingFee;

      // 4. Create Order
      const order = await this.orderRepository.create({ 
        ...data, 
        userId, 
        addressId, 
        total: finalAmount, 
        total_amount: subtotal 
      }, tx);

      // 4. Stock handling
      // - COD: deduct immediately.
      // - Online payment: only validate availability now; real deduction happens on payment callback success.
      const isOnlinePayment = data.paymentMethod !== 'COD';
      if (!isOnlinePayment) {
        for (const item of data.items) {
          await this.inventoryRepository.deductStock(item.variantId, item.quantity, order.id, tx);
        }
      } else {
        const minExpiry = new Date();
        minExpiry.setMonth(minExpiry.getMonth() + 3);

        for (const item of data.items) {
          const aggregate = await tx.batch.aggregate({
            where: {
              variantId: item.variantId,
              expiryDate: { gt: minExpiry },
              quantity: { gt: 0 }
            },
            _sum: { quantity: true }
          });

          const availableQty = aggregate._sum.quantity || 0;
          if (availableQty < item.quantity) {
            throw new Error(`Sản phẩm [${item.variantId}] không đủ tồn kho hợp lệ (hạn sử dụng > 3 tháng).`);
          }
        }
      }

      // 5. Create Notification for Admin
      this.notificationService.createNotification({
        title: "Đơn hàng mới",
        content: `Cửa hàng vừa nhận đơn hàng mới #${order.id} trị giá ${finalAmount.toLocaleString()}đ`,
        type: NotificationType.NEW_ORDER,
        metadata: { orderId: order.id }
      }).catch(console.error);

      // 6. Send Email (Non-blocking, after transaction)
      // Only send immediately for COD. For online payments, we wait for payment link success or actual payment.
      if (data.paymentMethod === 'COD') {
        if (data.customer?.email) {
          this.mailService.sendOrderConfirmation(data.customer.email, order, rawPassword).catch(console.error);
        } else if (userId) {
          this.userService.getUserById(userId).then(user => {
            if (user?.email) {
              this.mailService.sendOrderConfirmation(user.email, order, rawPassword).catch(console.error);
            }
          }).catch(console.error);
        }
      }

      return order;
    });
  }

  async sendOrderConfirmationEmail(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) return;

    const user = await this.userService.getUserById(order.userId);
    if (user?.email) {
      this.mailService.sendOrderConfirmation(user.email, order as any).catch(console.error);
    }
  }

  async updateOrder(id: string, data: UpdateOrderDTO): Promise<Order> {
    return await prisma.$transaction(async (tx: any) => {
      const oldOrder = await this.orderRepository.findWithItems(id, tx);
      if (!oldOrder) throw new Error("Order not found");

      if (data.payment_status === 'REFUNDED') {
        const nextOrderStatus = data.current_status || oldOrder.current_status;
        const canRefundStatus = nextOrderStatus === 'RETURNED' || nextOrderStatus === 'CANCELLED';

        if (oldOrder.payment_status !== 'PAID') {
          throw new Error("Chỉ có thể chuyển sang REFUNDED khi đơn đã thanh toán.");
        }

        if (!canRefundStatus) {
          throw new Error("Chỉ có thể đánh dấu REFUNDED cho đơn RETURNED hoặc CANCELLED.");
        }
      }

      // Automation logic
      if (oldOrder.payment_method === 'COD' && data.current_status === 'DELIVERED') {
        data.payment_status = 'PAID';
      }

      const updatedOrder = await this.orderRepository.update(id, data, tx);

      // Status transition logic
      if (data.current_status && oldOrder.current_status !== data.current_status) {
        // Stock Restoration and Voucher Restoration
        if (data.current_status === 'CANCELLED' && oldOrder.current_status !== 'CANCELLED') {
          await this.inventoryRepository.restoreStock(id, tx);
          
          // Restore voucher usage count if exists
          if (oldOrder.discountCodeId) {
            await tx.discountCode.update({
              where: { id: oldOrder.discountCodeId },
              data: { used_count: { decrement: 1 } }
            });
          }
        }

        // Sync Sold Counts (Could be in a ProductService)
        await this.syncSoldCounts(id, oldOrder.current_status, data.current_status, tx);
        
        // Grant Points on Delivery
        if (data.current_status === 'DELIVERED' && oldOrder.current_status !== 'DELIVERED') {
           const pointPercentage = await this.settingService.getPointPercentage();
           if (pointPercentage > 0) {
             const pointsEarned = Math.floor(updatedOrder.final_amount * (pointPercentage / 100));
             if (pointsEarned > 0) {
               await tx.user.update({
                 where: { id: updatedOrder.userId },
                 data: { loyalty_points: { increment: pointsEarned }, lifetime_points: { increment: pointsEarned } }
               });
               await tx.pointTransaction.create({
                 data: { userId: updatedOrder.userId, amount: pointsEarned, reason: `Tích điểm từ đơn hàng ${updatedOrder.id}`, type: "EARN" }
               });
             }
           }
        }
      }

      return updatedOrder;
    });
  }

  async refundPaidOrder(id: string): Promise<Order> {
    return await prisma.$transaction(async (tx: any) => {
      const order = await this.orderRepository.findWithItems(id, tx);
      if (!order) throw new Error("Order not found");

      if (order.payment_status === "REFUNDED") {
        return order;
      }

      if (order.payment_status !== "PAID") {
        throw new Error("Chỉ có thể hoàn tiền cho đơn đã thanh toán.");
      }

      if (!["CANCELLED", "RETURNED"].includes(order.current_status)) {
        throw new Error("Chỉ có thể hoàn tiền cho đơn CANCELLED hoặc RETURNED.");
      }

      console.info("[MANUAL_REFUND_APPROVED]", {
        orderId: order.id,
        currentStatus: order.current_status,
        paymentMethod: order.payment_method,
        finalAmount: order.final_amount,
        reason: "Manual refund approved in admin",
      });

      return await this.orderRepository.update(id, { payment_status: "REFUNDED" }, tx);
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

  async deleteUnpaidOrder(id: string): Promise<void> {
    await prisma.$transaction(async (tx: any) => {
      const order = await tx.order.findUnique({
        where: { id },
        include: {
          items: true,
          discountCode: true,
        },
      });

      if (!order) {
        throw new Error("Order not found");
      }

      if (order.payment_status === 'PAID') {
        throw new Error("Order already paid");
      }

      // Only allow hard-delete while order is still at early stage.
      if (order.current_status !== 'PENDING') {
        throw new Error("Chỉ có thể xóa đơn chưa thanh toán ở trạng thái chờ xác nhận.");
      }

      // In case stock was reserved/deducted (e.g., COD), restore by transaction history.
      await this.inventoryRepository.restoreStock(id, tx);

      if (order.discountCodeId) {
        await tx.discountCode.updateMany({
          where: {
            id: order.discountCodeId,
            used_count: { gt: 0 },
          },
          data: {
            used_count: { decrement: 1 },
          },
        });
      }

      // Restore redeemed points only for online payment orders cancelled before payment success.
      if (order.payment_method !== 'COD' && (order.discountCode?.point_cost || 0) > 0) {
        const refundedPoints = order.discountCode?.point_cost || 0;
        await tx.user.update({
          where: { id: order.userId },
          data: { loyalty_points: { increment: refundedPoints } },
        });

        await tx.pointTransaction.create({
          data: {
            userId: order.userId,
            amount: refundedPoints,
            reason: `Hoàn điểm do hủy đơn chưa thanh toán ${order.id}`,
            type: 'EARN',
          },
        });
      }

      await tx.order.delete({ where: { id } });
    });
  }
}
