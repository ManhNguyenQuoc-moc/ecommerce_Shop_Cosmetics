import { Order, Prisma } from "@prisma/client";
import { CreateOrderDTO, OrderQueryFiltersDTO, UpdateOrderDTO } from "../DTO/order/order.dto";

export interface IOrderRepository {
  findAll(skip?: number, take?: number, filters?: OrderQueryFiltersDTO): Promise<[Order[], number]>;
  findById(id: string): Promise<Order | null>;
  create(data: CreateOrderDTO & { userId: string, addressId?: string }, tx?: Prisma.TransactionClient): Promise<Order>;
  update(id: string, data: UpdateOrderDTO, tx?: Prisma.TransactionClient): Promise<Order>;
  delete(id: string): Promise<void>;
  
  // Additional methods for coordination
  findWithItems(id: string, tx?: Prisma.TransactionClient): Promise<Order & { items: any[] } | null>;
}
