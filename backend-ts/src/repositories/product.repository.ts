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

  async findAllUnpaginated(): Promise<Product[]> {
    return prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        variants: { include: { image: true } },
        reviews: true,
        productImages: { include: { image: true }, orderBy: { order: 'asc' } },
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(identifier: string): Promise<Product | null> {
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    const whereClause = isUUID ? { id: identifier } : { slug: identifier };

    return prisma.product.findUnique({
      where: whereClause,
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

  async createWithTransactions(data: any): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: data.name,
          slug: data.slug,
          short_description: data.short_description,
          long_description: data.long_description,
          brandId: data.brandId,
          categoryId: data.categoryId,
          price: data.price,
          salePrice: data.salePrice,
          status: data.status || 'ACTIVE',
          specifications: data.specifications || [],
        }
      });
      if (data.imageIds && data.imageIds.length > 0) {
        await tx.productImage.createMany({
          data: data.imageIds.map((imageId: string, index: number) => ({
            productId: product.id,
            imageId: imageId,
            order: index
          }))
        });
      }
      if (data.variants && data.variants.length > 0) {
        for (const variant of data.variants) {
          await tx.productVariant.create({
            data: {
              productId: product.id,
              color: variant.color || null,
              size: variant.size || null,
              price: Number(variant.price),
              salePrice: variant.salePrice ? Number(variant.salePrice) : null,
              stock_quantity: Number(variant.stock_quantity),
              imageId: variant.imageId || null,
              statusName: variant.statusName || 'NEW',
            }
          });
        }
      }
      return product;
    });
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
