import { Order } from "@prisma/client";

export interface IOrderRepository {
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
  create(data: any): Promise<Order>;
  update(id: string, data: any): Promise<Order>;
  delete(id: string): Promise<void>;
}
