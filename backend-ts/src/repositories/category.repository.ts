import { Category, Prisma } from "@prisma/client";
import { ICategoryRepository } from "../interfaces/ICategoryRepository";
import { prisma } from "../config/prisma";

export class CategoryRepository implements ICategoryRepository {
  async findAll(page: number, limit: number, searchTerm?: string): Promise<{ data: Category[]; total: number }> {
    const skip = (page - 1) * limit;
    
    // Xây dựng điều kiện tìm kiếm
    const where: Prisma.CategoryWhereInput = {};
    
    if (searchTerm) {
      where.OR = [
        { name: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }
    
    // Lấy dữ liệu và tổng số bản ghi bằng Promise.all thay vì $transaction để tránh timeout
    const [data, total] = await Promise.all([
      prisma.category.findMany({
        where,
        skip,
        take: limit,
        include: {
          products: {
            select: { id: true } // Chỉ lấy id để nhẹ log nếu thật sự cần
          },
          image: true,
        },
        orderBy: [
          { createdAt: 'desc' },
          { id: 'desc' }
        ],
      }),
      prisma.category.count({ where }),
    ]);

    return { data, total };
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        products: true,
        image: true,
      },
    });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({ data });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
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
