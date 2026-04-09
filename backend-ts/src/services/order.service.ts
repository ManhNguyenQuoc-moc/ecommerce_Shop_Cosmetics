import { Order } from "@prisma/client";
import { IOrderRepository } from "../interfaces/IOrderRepository";
import { IOrderService } from "../interfaces/IOrderService";
import { OrderMapper } from "../mappers/order.mapper";

export class OrderService implements IOrderService {
  private readonly orderRepository: IOrderRepository;

  constructor(orderRepository: IOrderRepository) {
    this.orderRepository = orderRepository;
  }

  async getOrders(page?: number, pageSize?: number, filters?: any): Promise<{ items: any[], total: number }> {
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
