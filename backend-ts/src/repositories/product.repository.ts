import { PrismaClient, Product, Prisma, ProductVariant } from "@prisma/client";
import { IProductRepository, ProductQueryFilters, VariantQueryFilters, ProductVariantWithRelations } from "../interfaces/IProductRepository";
import { prisma } from "../config/prisma";
import { CreateProductDTO, CreateVariantDTO } from "../DTO/product/input/AddProductDTO";
import { UpdateProductDTO, UpdateVariantDTO } from "../DTO/product/input/UpdateProductDTO";

export class ProductRepository implements IProductRepository {
  async findAll(page: number = 1, pageSize: number = 10, filters?: ProductQueryFilters): Promise<{ products: Product[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const conditions: Prisma.Sql[] = [];

    if (filters?.brandId && filters.brandId !== 'all') {
      conditions.push(Prisma.sql`p."brandId" = ${filters.brandId}`);
    }
    if (filters?.categoryId && filters.categoryId !== 'all') {
      conditions.push(Prisma.sql`p."categoryId" = ${filters.categoryId}`);
    }
    if (filters?.status && filters.status !== 'all') {
      if (filters.status === 'active_tab') {
        conditions.push(Prisma.sql`p."status"::text IN ('ACTIVE', 'STOPPED')`);
      } else {
        const statusMap: Record<string, string> = {
          'active': 'ACTIVE',
          'hidden': 'HIDDEN',
          'out_of_stock': 'STOPPED'
        };
        if (statusMap[filters.status]) {
          conditions.push(Prisma.sql`p."status"::text = ${statusMap[filters.status]}`);
        }
      }
    }
    if (filters?.searchTerm && filters.searchTerm.trim() !== '') {
      const search = `%${filters.searchTerm.trim().toLowerCase()}%`;
      conditions.push(Prisma.sql`(LOWER(p."name") LIKE ${search} OR LOWER(p."slug") LIKE ${search})`);
    }
    if (filters?.soldRange && filters.soldRange !== 'all') {
      switch (filters.soldRange) {
        case 'under_50': conditions.push(Prisma.sql`p."sold" < 50`); break;
        case '50_200': conditions.push(Prisma.sql`p."sold" >= 50 AND p."sold" <= 200`); break;
        case '200_500': conditions.push(Prisma.sql`p."sold" >= 200 AND p."sold" <= 500`); break;
        case 'above_500': conditions.push(Prisma.sql`p."sold" > 500`); break;
      }
    }

    const where = conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty;

    let orderBy = Prisma.sql`p."createdAt" DESC`;
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'oldest': orderBy = Prisma.sql`p."createdAt" ASC`; break;
        case 'price_asc': orderBy = Prisma.sql`p."price" ASC`; break;
        case 'price_desc': orderBy = Prisma.sql`p."price" DESC`; break;
        case 'sold_desc': orderBy = Prisma.sql`p."sold" DESC`; break;
        case 'sold_asc': orderBy = Prisma.sql`p."sold" ASC`; break;
      }
    }

    const productsQuery = Prisma.sql`
      SELECT 
        p.*,
        (SELECT json_build_object('id', b.id, 'name', b.name, 'slug', b.slug) FROM "Brand" b WHERE b.id = p."brandId") as brand,
        (SELECT json_build_object('id', c.id, 'name', c.name, 'slug', c.slug) FROM "Category" c WHERE c.id = p."categoryId") as category,
        (
          SELECT COALESCE(json_agg(v_data), '[]'::json)
          FROM (
            SELECT v.*, (SELECT json_build_object('id', img.id, 'url', img.url) FROM "Image" img WHERE img.id = v."imageId") as image
            FROM "ProductVariant" v 
            WHERE v."productId" = p.id
          ) v_data
        ) as variants,
        (SELECT COALESCE(json_agg(r), '[]'::json) FROM "Review" r WHERE r."productId" = p.id) as reviews,
        (
          SELECT COALESCE(json_agg(pi_data), '[]'::json)
          FROM (
            SELECT pi.*, (SELECT json_build_object('id', img.id, 'url', img.url) FROM "Image" img WHERE img.id = pi."imageId") as image
            FROM "ProductImage" pi 
            WHERE pi."productId" = p.id
            ORDER BY pi."order" ASC
          ) pi_data
        ) as "productImages"
      FROM "Product" p
      ${where}
      ORDER BY ${orderBy}
      LIMIT ${pageSize} OFFSET ${skip}
    `;

    const countQuery = Prisma.sql`SELECT COUNT(*) as count FROM "Product" p ${where}`;

    const [products, totalResult] = await Promise.all([
      prisma.$queryRaw<any[]>(productsQuery),
      prisma.$queryRaw<any[]>(countQuery)
    ]);

    const total = Number(totalResult[0]?.count || 0);

    return { products, total };
  }

  async updateWithTransactions(id: string, data: UpdateProductDTO & { newImageIds: string[] }): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      // 1. Update core product fields
      const slugData: { slug?: string } = {};
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
          ...(data.specifications !== undefined && { specifications: data.specifications as any }),
        },
      });

      // 2. Remove old image links
      if (data.imageIdsToRemove && data.imageIdsToRemove.length > 0) {
        await tx.productImage.deleteMany({
          where: { productId: id, imageId: { in: data.imageIdsToRemove } },
        });
      }

      // 3. Add new image links
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
        const existingIds = new Set(existingVariants.map((v) => v.id));
        const incomingIds = new Set(
          data.variants.filter((v) => v.id).map((v) => v.id as string)
        );

        // Soft-delete variants not present in incoming list
        for (const ev of existingVariants) {
          if (!incomingIds.has(ev.id)) {
            await tx.productVariant.update({
              where: { id: ev.id },
              data: { status: 'HIDDEN' },
            });
          }
        }

        // Create or Update incoming variants
        for (const v of data.variants) {
          if (v.id && existingIds.has(v.id)) {
            // UPDATE existing
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                ...(v.color !== undefined && { color: v.color }),
                ...(v.size !== undefined && { size: v.size }),
                ...(v.sku !== undefined && { sku: v.sku }),
                ...(v.price !== undefined && { price: Number(v.price) }),
                ...(v.salePrice !== undefined && { salePrice: v.salePrice !== null ? Number(v.salePrice) : null }),
                ...(v.imageId !== undefined && { imageId: v.imageId }),
                ...(v.statusName && { statusName: v.statusName }),
                status: 'ACTIVE',
              },
            });
          } else if (!v.id) {
            // CREATE new
            await tx.productVariant.create({
              data: {
                productId: id,
                color: v.color || null,
                size: v.size || null,
                sku: v.sku || null,
                price: Number(v.price),
                salePrice: v.salePrice ? Number(v.salePrice) : null,
                costPrice: 0,
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
      await tx.product.updateMany({
        where: { id: { in: ids } },
        data: { status: 'HIDDEN' },
      });
      await tx.productVariant.updateMany({
        where: { productId: { in: ids } },
        data: { status: 'HIDDEN' },
      });
    });
  }

  async getVariants(page: number, pageSize: number, filters?: VariantQueryFilters): Promise<{ variants: ProductVariantWithRelations[]; total: number }> {
    const skip = (page - 1) * pageSize;
    const conditions: Prisma.Sql[] = [];

    // 1. Status Filter
    if (filters?.status && filters.status !== 'all') {
      conditions.push(Prisma.sql`v."status"::text = ${filters.status.toUpperCase()}`);
    }

    // 2. Search Filter
    if (filters?.searchTerm && filters.searchTerm.trim() !== '') {
      const search = `%${filters.searchTerm.trim().toLowerCase()}%`;
      conditions.push(Prisma.sql`(
        v."sku" ILIKE ${search} OR 
        v."color" ILIKE ${search} OR 
        v."size" ILIKE ${search} OR 
        p."name" ILIKE ${search}
      )`);
    }

    // 3. Classification Filter
    if (filters?.classification && filters.classification !== 'all') {
      if (filters.classification === 'color') {
        conditions.push(Prisma.sql`v."color" IS NOT NULL`);
      } else if (filters.classification === 'size' || filters.classification === 'volume') {
        conditions.push(Prisma.sql`v."size" IS NOT NULL`);
      }
    }

    // 4. Price Range Filter
    if (filters?.priceRange && filters.priceRange !== 'all') {
      switch (filters.priceRange) {
        case 'under_500k': conditions.push(Prisma.sql`v."price" < 500000`); break;
        case '500k_1m': conditions.push(Prisma.sql`v."price" >= 500000 AND v."price" <= 1000000`); break;
        case '1m_2m': conditions.push(Prisma.sql`v."price" >= 1000000 AND v."price" <= 2000000`); break;
        case 'above_2m': conditions.push(Prisma.sql`v."price" > 2000000`); break;
      }
    }

    // 5. Status Name (Nhãn) Filter
    if (filters?.statusName && filters.statusName !== 'all') {
      conditions.push(Prisma.sql`v."statusName"::text = ${filters.statusName}`);
    }

    const where = conditions.length > 0 ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty;

    let orderBy = Prisma.sql`v."createdAt" DESC`;
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'oldest': orderBy = Prisma.sql`v."createdAt" ASC`; break;
        case 'price_asc': orderBy = Prisma.sql`v."price" ASC`; break;
        case 'price_desc': orderBy = Prisma.sql`v."price" DESC`; break;
      }
    }

    const variantsQuery = Prisma.sql`
      SELECT 
        v.*,
        (
          SELECT json_build_object(
            'id', p.id, 
            'name', p.name, 
            'slug', p.slug, 
            'status', p.status,
            'brand', (SELECT json_build_object('id', b.id, 'name', b.name) FROM "Brand" b WHERE b.id = p."brandId"),
            'category', (SELECT json_build_object('id', cat.id, 'name', cat.name) FROM "Category" cat WHERE cat.id = p."categoryId"),
            'productImages', (
               SELECT COALESCE(json_agg(pi_sub), '[]'::json)
               FROM (
                 SELECT pi.*, (SELECT json_build_object('url', img.url) FROM "Image" img WHERE img.id = pi."imageId") as image
                 FROM "ProductImage" pi WHERE pi."productId" = p.id ORDER BY pi."order" ASC LIMIT 1
               ) pi_sub
            )
          )
        ) as product,
        (SELECT json_build_object('id', i.id, 'url', i.url) FROM "Image" i WHERE i.id = v."imageId") as image,
        (SELECT COALESCE(json_agg(oi), '[]'::json) FROM "OrderItem" oi WHERE oi."variantId" = v.id) as "orderItems"
      FROM "ProductVariant" v
      INNER JOIN "Product" p ON v."productId" = p.id
      ${where}
      ORDER BY ${orderBy}
      LIMIT ${pageSize} OFFSET ${skip}
    `;

    const countQuery = Prisma.sql`
      SELECT COUNT(*) as count 
      FROM "ProductVariant" v 
      INNER JOIN "Product" p ON v."productId" = p.id 
      ${where}
    `;

    const [variants, totalResult] = await Promise.all([
      prisma.$queryRaw<ProductVariantWithRelations[]>(variantsQuery),
      prisma.$queryRaw<any[]>(countQuery)
    ]);

    const total = Number(totalResult[0]?.count || 0);

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

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return prisma.product.create({ data });
  }

  async createWithTransactions(data: CreateProductDTO & { imageIds: string[] }): Promise<Product> {
    return prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          name: data.name,
          slug: data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          short_description: data.short_description,
          long_description: data.long_description,
          brandId: data.brandId,
          categoryId: data.categoryId,
          price: data.price,
          salePrice: data.salePrice,
          status: data.status || 'ACTIVE',
          specifications: (data.specifications as unknown as Prisma.InputJsonValue) || [],
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
              sku: variant.sku || this.generateSKU(),
              price: Number(variant.price),
              salePrice: variant.salePrice ? Number(variant.salePrice) : null,
              costPrice: 0,
              imageId: variant.imageId || null,
              statusName: variant.statusName || 'NEW',
            }
          });
        }
      }
      return product;
    });
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }

  async createVariant(data: CreateVariantDTO & { productId: string }): Promise<ProductVariant> {
    return prisma.productVariant.create({
      data: {
        productId: data.productId,
        color: data.color || null,
        size: data.size || null,
        sku: data.sku || this.generateSKU(),
        price: Number(data.price),
        salePrice: data.salePrice ? Number(data.salePrice) : null,
        costPrice: 0,
        imageId: data.imageId || null,
        statusName: data.statusName || 'NEW',
      }
    });
  }

  async updateVariant(id: string, data: UpdateVariantDTO): Promise<ProductVariant> {
    return prisma.productVariant.update({
      where: { id },
      data: {
        color: data.color,
        size: data.size,
        sku: data.sku,
        price: data.price !== undefined ? Number(data.price) : undefined,
        salePrice: data.salePrice !== undefined ? (data.salePrice ? Number(data.salePrice) : null) : undefined,
        imageId: data.imageId,
        statusName: data.statusName,
      }
    });
  }

  async softDeleteVariants(ids: string[]): Promise<void> {
    await prisma.productVariant.updateMany({
      where: { id: { in: ids } },
      data: { status: 'HIDDEN' },
    });
  }

  async restoreProducts(ids: string[]): Promise<void> {
    await prisma.$transaction(async (tx) => {
      await tx.product.updateMany({
        where: { id: { in: ids } },
        data: { status: 'ACTIVE' },
      });
      await tx.productVariant.updateMany({
        where: { productId: { in: ids } },
        data: { status: 'ACTIVE' },
      });
    });
  }

  async restoreVariants(ids: string[]): Promise<void> {
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

  private generateSKU(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `VAR-${date}-${random}`;
  }
}

