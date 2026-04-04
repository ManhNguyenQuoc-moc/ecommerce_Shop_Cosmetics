import { Order } from "@prisma/client";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { IOrderService } from "../interfaces/IOrderService";

export class OrderService implements IOrderService {
  private readonly orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getOrders(page?: number, pageSize?: number): Promise<{ items: Order[], total: number }> {
    const skip = page && pageSize ? (page - 1) * pageSize : undefined;
    const take = pageSize || undefined;
    const [items, total] = await this.orderRepository.findAll(skip, take);
    return { items, total };
  }

  async getOrderById(id: string): Promise<Order | null> {
    return this.orderRepository.findById(id);
  }

  async createOrder(data: any): Promise<Order> {
    return this.orderRepository.create(data);
  }

  async updateOrder(id: string, data: any): Promise<Order> {
    return this.orderRepository.update(id, data);
  }

  async deleteOrder(id: string): Promise<void> {
    return this.orderRepository.delete(id);
  }
}
