import { PrismaClient, Product } from "@prisma/client";
import { IProductRepository } from "../interfaces/IProductRepository";
import { prisma } from "../config/prisma";

export class ProductRepository implements IProductRepository {
  async findAll(page: number = 1, limit: number = 10, brandId?: string): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (brandId) where.brandId = brandId;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          brand: true,
          category: true,
          variants: { include: { image: true, orderItems: true } },
          reviews: true,
          productImages: { include: { image: true }, orderBy: { order: 'asc' } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async getVariants(page: number = 1, limit: number = 10): Promise<{ variants: any[]; total: number }> {
    const skip = (page - 1) * limit;
    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        skip,
        take: limit,
        include: {
          product: {
            include: { brand: true, category: true }
          },
          image: true,
          orderItems: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.productVariant.count(),
    ]);

    return { variants, total };
  }

  async findAllUnpaginated(): Promise<Product[]> {
    return prisma.product.findMany({
      include: {
        brand: true,
        category: true,
        variants: { include: { image: true, orderItems: true } },
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
        variants: { include: { image: true, orderItems: true } },
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
              sku: variant.sku || null,
              price: Number(variant.price),
              salePrice: variant.salePrice ? Number(variant.salePrice) : null,
              costPrice: variant.costPrice ? Number(variant.costPrice) : 0,
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
    await prisma.product.delete({ where: { id } });
  }

  async createVariant(data: any): Promise<any> {
    return prisma.productVariant.create({
      data: {
        productId: data.productId,
        color: data.color || null,
        size: data.size || null,
        sku: data.sku || null,
        price: Number(data.price),
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        costPrice: data.costPrice ? Number(data.costPrice) : 0,
        imageId: data.imageId || null,
        statusName: data.statusName || 'NEW',
      }
    });
  }

  async updateVariant(id: string, data: any): Promise<any> {
    return prisma.productVariant.update({
      where: { id },
      data: {
        color: data.color,
        size: data.size,
        sku: data.sku,
        price: data.price !== undefined ? Number(data.price) : undefined,
        salePrice: data.salePrice !== undefined ? (data.salePrice ? Number(data.salePrice) : null) : undefined,
        costPrice: data.costPrice !== undefined ? Number(data.costPrice) : undefined,
        imageId: data.imageId,
        statusName: data.statusName,
      }
    });
  }
}
