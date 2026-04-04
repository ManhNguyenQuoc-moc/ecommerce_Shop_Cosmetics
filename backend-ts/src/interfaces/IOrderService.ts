import { Order } from "@prisma/client";

export interface IOrderService {
  getOrders(page?: number, pageSize?: number): Promise<{ items: Order[], total: number }>;
  getOrderById(id: string): Promise<Order | null>;
  createOrder(data: any): Promise<Order>;
  updateOrder(id: string, data: any): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
}
