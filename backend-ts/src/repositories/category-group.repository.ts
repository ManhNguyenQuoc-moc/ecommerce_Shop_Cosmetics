import { PrismaClient, CategoryGroup } from "@prisma/client";
import { ICategoryGroupRepository } from "../interfaces/ICategoryGroupRepository";
import { prisma } from "../config/prisma";

export class CategoryGroupRepository implements ICategoryGroupRepository {
  async findAll(page: number, limit: number, searchTerm?: string): Promise<{ data: CategoryGroup[]; total: number }> {
    const skip = (page - 1) * limit;
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {};
    if (searchTerm) {
      whereClause.name = {
        contains: searchTerm,
        mode: "insensitive"
      };
    }

    const [data, total] = await Promise.all([
      prisma.categoryGroup.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.categoryGroup.count({ where: whereClause })
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<CategoryGroup | null> {
    return prisma.categoryGroup.findUnique({
      where: { id },
      include: { categories: true }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async create(data: any): Promise<CategoryGroup> {
    return prisma.categoryGroup.create({
      data
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async update(id: string, data: any): Promise<CategoryGroup> {
    return prisma.categoryGroup.update({
      where: { id },
      data
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.categoryGroup.delete({
      where: { id }
    });
  }
}
