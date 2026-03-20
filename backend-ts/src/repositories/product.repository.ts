import { PrismaClient, Product } from "@prisma/client";
import { IProductRepository } from "../interfaces/IProductRepository";
import { prisma } from "../config/prisma";

export class ProductRepository implements IProductRepository {
  async findAll(page: number = 1, limit: number = 10): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        include: {
          brand: true,
          category: true,
          variants: { include: { image: true } },
          reviews: true,
          productImages: { include: { image: true }, orderBy: { order: 'asc' } },
        },
      }),
      prisma.product.count(),
    ]);

    return { products, total };
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: { include: { image: true } },
        reviews: true,
        productImages: { include: { image: true }, orderBy: { order: 'asc' } },
      },
    });
  }

  async create(data: any): Promise<Product> {
    return prisma.product.create({ data });
  }

  async update(id: string, data: any): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }
}
