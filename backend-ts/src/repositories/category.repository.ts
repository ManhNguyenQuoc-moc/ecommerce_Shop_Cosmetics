import { Category } from "@prisma/client";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { prisma } from "../config/prisma";

export class CategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany({
      include: {
        products: true,
      },
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
      },
    });
  }

  async create(data: any): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: any): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }
}
