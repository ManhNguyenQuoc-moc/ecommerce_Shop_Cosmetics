import { Order } from "@prisma/client";
import { OrderQueryFilters } from "./IOrderRepository";

export interface IOrderService {
  getOrders(page?: number, pageSize?: number, filters?: OrderQueryFilters): Promise<{ items: any[], total: number }>;
  getOrderById(id: string): Promise<any | null>;
  createOrder(data: any): Promise<Order>;
  updateOrder(id: string, data: any): Promise<Order>;
  deleteOrder(id: string): Promise<void>;
}
