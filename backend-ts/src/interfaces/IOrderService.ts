import { Order } from "@prisma/client";
import { CreateOrderDTO, OrderQueryFiltersDTO, UpdateOrderDTO } from "../DTO/order/order.dto";

export interface IOrderService {
  getOrders(page?: number, pageSize?: number, filters?: OrderQueryFiltersDTO): Promise<{ items: any[], total: number }>;
  getOrderById(id: string): Promise<any | null>;
  createOrder(data: CreateOrderDTO): Promise<Order>;
  updateOrder(id: string, data: UpdateOrderDTO): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
  deleteUnpaidOrder(id: string): Promise<void>;
  sendOrderConfirmationEmail(orderId: string): Promise<void>;
}
