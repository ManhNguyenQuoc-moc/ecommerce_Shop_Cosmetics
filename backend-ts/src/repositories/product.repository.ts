import { PrismaClient, Product } from "@prisma/client";
import { IProductRepository, ProductQueryFilters } from "../interfaces/IProductRepository";
import { prisma } from "../config/prisma";

export class ProductRepository implements IProductRepository {
  async findAll(page: number = 1, pageSize: number = 10, filters?: ProductQueryFilters): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const where: any = {};
    
    if (filters?.brandId) where.brandId = filters.brandId;
    if (filters?.categoryId && filters.categoryId !== 'all') where.categoryId = filters.categoryId;

    if (filters?.status && filters.status !== 'all') {
      const statusMap: Record<string, string> = {
        'active': 'ACTIVE',
        'hidden': 'HIDDEN',
        'out_of_stock': 'STOPPED' // or whichever applies
      };
      if (statusMap[filters.status]) {
        where.status = statusMap[filters.status];
      }
    }

    if (filters?.searchTerm && filters.searchTerm.trim() !== '') {
      // Normalize search term by removing all spaces and converting to lower case
      const searchNormalized = filters.searchTerm.replace(/\s+/g, '').toLowerCase();
      
      // Use Raw SQL for robust string normalization (removes spaces from DB columns before matching)
      const matchingIdsData = await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT "id" FROM "Product"
        WHERE REPLACE(LOWER("name"), ' ', '') LIKE ${'%' + searchNormalized + '%'}
           OR REPLACE(LOWER("slug"), ' ', '') LIKE ${'%' + searchNormalized + '%'}
      `;
      
      const matchingIds = matchingIdsData.map(r => r.id);
      
      if (matchingIds.length > 0) {
        where.id = { in: matchingIds };
      } else {
        // Force empty result if no match
        where.id = 'NO-MATCH-FOUND'; 
      }
    }

    if (filters?.soldRange && filters.soldRange !== 'all') {
      switch (filters.soldRange) {
        case 'under_50': where.sold = { lt: 50 }; break;
        case '50_200': where.sold = { gte: 50, lte: 200 }; break;
        case '200_500': where.sold = { gte: 200, lte: 500 }; break;
        case 'above_500': where.sold = { gt: 500 }; break;
      }
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'oldest': orderBy = { createdAt: 'asc' }; break;
        case 'price_asc': orderBy = { price: 'asc' }; break;
        case 'price_desc': orderBy = { price: 'desc' }; break;
        case 'sold_desc': orderBy = { sold: 'desc' }; break;
        case 'sold_asc': orderBy = { sold: 'asc' }; break;
        default: orderBy = { createdAt: 'desc' }; // 'newest'
      }
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: pageSize,
        orderBy,
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

  async updateWithTransactions(id: string, data: any): Promise<any> {
    return prisma.$transaction(async (tx) => {
      // 1. Update core product fields
      const slugData: any = {};
      if (data.name) {
        const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
        const existing = await tx.product.findFirst({ where: { slug, NOT: { id } } });
        if (!existing) slugData.slug = slug;
      }

      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          ...(data.name && { name: data.name, ...slugData }),
          ...(data.short_description !== undefined && { short_description: data.short_description }),
          ...(data.long_description !== undefined && { long_description: data.long_description }),
          ...(data.categoryId && { categoryId: data.categoryId }),
          ...(data.brandId && { brandId: data.brandId }),
          ...(data.status && { status: data.status }),
          ...(data.price !== undefined && { price: Number(data.price) }),
          ...(data.salePrice !== undefined && { salePrice: data.salePrice ? Number(data.salePrice) : null }),
          ...(data.specifications !== undefined && { specifications: data.specifications }),
        },
      });

      // 2. Remove old image links
      if (data.imageIdsToRemove && data.imageIdsToRemove.length > 0) {
        await tx.productImage.deleteMany({
          where: { productId: id, imageId: { in: data.imageIdsToRemove } },
        });
      }

      // 3. Add new image links (imageIds come pre-uploaded from service layer)
      if (data.newImageIds && data.newImageIds.length > 0) {
        const maxOrderResult = await tx.productImage.findFirst({
          where: { productId: id },
          orderBy: { order: 'desc' },
        });
        const startOrder = (maxOrderResult?.order ?? -1) + 1;
        await tx.productImage.createMany({
          data: data.newImageIds.map((imageId: string, i: number) => ({
            productId: id,
            imageId,
            order: startOrder + i,
          })),
        });
      }

      // 4. Sync variants
      if (data.variants !== undefined) {
        const existingVariants = await tx.productVariant.findMany({ where: { productId: id } });
        const existingIds = new Set(existingVariants.map((v: any) => v.id));
        const incomingIds = new Set(
          (data.variants as any[]).filter((v) => v.id).map((v) => v.id)
        );

        // Soft-delete variants not present in incoming list
        for (const ev of existingVariants) {
          if (!incomingIds.has(ev.id)) {
            await (tx.productVariant as any).update({
              where: { id: ev.id },
              data: { status: 'HIDDEN' },
            });
          }
        }

        // Create or Update incoming variants
        for (const v of data.variants as any[]) {
          if (v.id && existingIds.has(v.id)) {
            // UPDATE existing
            await (tx.productVariant as any).update({
              where: { id: v.id },
              data: {
                ...(v.color !== undefined && { color: v.color }),
                ...(v.size !== undefined && { size: v.size }),
                ...(v.sku !== undefined && { sku: v.sku }),
                ...(v.price !== undefined && { price: Number(v.price) }),
                ...(v.salePrice !== undefined && { salePrice: v.salePrice !== null ? Number(v.salePrice) : null }),
                // Fix: Also allow updating to null (removing image)
                ...(v.imageId !== undefined && { imageId: v.imageId }),
                ...(v.statusName && { statusName: v.statusName }),
                status: 'ACTIVE',
              },
            });
          } else if (!v.id) {
            // CREATE new
            await (tx.productVariant as any).create({
              data: {
                productId: id,
                color: v.color || null,
                size: v.size || null,
                sku: v.sku || null,
                price: Number(v.price),
                salePrice: v.salePrice ? Number(v.salePrice) : null,
                costPrice: v.costPrice ? Number(v.costPrice) : 0,
                imageId: v.imageId || null,
                statusName: v.statusName || 'NEW',
                status: 'ACTIVE',
              },
            });
          }
        }
      }

      return updatedProduct;
    });
  }

  async softDeleteProducts(ids: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Hide the products
      await tx.product.updateMany({
        where: { id: { in: ids } },
        data: { status: 'HIDDEN' },
      });
      // Hide all their variants too
      await (tx.productVariant as any).updateMany({
        where: { productId: { in: ids } },
        data: { status: 'HIDDEN' },
      });
    });
  }
  async getVariants(page: number = 1, pageSize: number = 10, status?: string): Promise<{ variants: any[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const where: any = {};
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }
    const [variants, total] = await Promise.all([
      prisma.productVariant.findMany({
        where,
        skip,
        take: pageSize,
        include: {
          product: {
            include: { brand: true, category: true }
          },
          image: true,
          orderItems: true
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.productVariant.count({ where }),
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

  async softDeleteVariants(ids: string[]): Promise<void> {
    await (prisma.productVariant as any).updateMany({
      where: { id: { in: ids } },
      data: { status: 'HIDDEN' },
    });
  }

  async restoreProducts(ids: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Restore the products
      await tx.product.updateMany({
        where: { id: { in: ids } },
        data: { status: 'ACTIVE' },
      });
      // Restore all their variants too
      await (tx.productVariant as any).updateMany({
        where: { productId: { in: ids } },
        data: { status: 'ACTIVE' },
      });
    });
  }

  async restoreVariants(ids: string[]): Promise<void> {
    // Only restore variants whose parent product is ACTIVE
    const validVariants = await prisma.productVariant.findMany({
      where: {
        id: { in: ids },
        product: { status: 'ACTIVE' }
      },
      select: { id: true }
    });

    const validIds = validVariants.map(v => v.id);

    if (validIds.length > 0) {
      await prisma.productVariant.updateMany({
        where: { id: { in: validIds } },
        data: { status: 'ACTIVE' },
      });
    }
  }
}

