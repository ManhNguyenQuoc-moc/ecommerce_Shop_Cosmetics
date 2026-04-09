import { Order } from "@prisma/client";

export interface OrderQueryFilters {
  searchTerm?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export interface IOrderRepository {
  findAll(skip?: number, take?: number, filters?: OrderQueryFilters): Promise<[Order[], number]>;
  findById(id: string): Promise<Order | null>;
  create(data: any): Promise<Order>;
  update(id: string, data: any): Promise<Order>;
  delete(id: string): Promise<void>;
}
