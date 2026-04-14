import { IHomeService } from "../interfaces/IHomeService";
import { prisma } from "../config/prisma";
import { ProductListItemDto } from "../DTO/product/output/ProductListItemDto";
import { ProductStatus } from "@prisma/client";

export class HomeService implements IHomeService {
  async getHomeData(): Promise<any> {
    const variantInclude = {
      product: {
        include: {
          brand: true,
          category: true,
          productImages: { include: { image: true }, orderBy: { order: 'asc' as const } }
        }
      },
      image: true,
      orderItems: true
    };

    const fetchVariants = (status: ProductStatus) =>
      prisma.productVariant.findMany({
        where: {
          statusName: status,
          status: 'ACTIVE',
          product: { status: 'ACTIVE' }
        },
        take: 12,
        include: variantInclude,
        orderBy: status === 'NEW' ? { createdAt: 'desc' } : undefined
      });

    const [categories, trending, bestSelling, newArrivals, flashSale, brands] = await Promise.all([
      prisma.category.findMany({ 
        take: 50, 
        include: { 
            image: true,
            categoryGroup: true // Thêm để map đúng CategoryResponseDto
        } 
      }),
      fetchVariants('TRENDING'),
      fetchVariants('BEST_SELLING'),
      fetchVariants('NEW'),
      fetchVariants('SALE'),
      prisma.brand.findMany({
        where: { logoId: { not: null } },
        take: 8,
        include: { logo: true, banner: true }
      })
    ]);

    const mapVariant = (v: any): ProductListItemDto => {
      const p = v.product;
      const variantName = [p.name, v.color, v.size].filter(Boolean).join(' - ');
      const price = v.price || p.price;
      const salePrice = v.salePrice || null;
      return {
        id: p.id,
        slug: p.slug,
        variantId: v.id,
        name: variantName,
        brand: p.brand ? { id: p.brand.id, name: p.brand.name } : null,
        category: p.category ? { id: p.category.id, name: p.category.name } : null,
        price,
        salePrice,
        minPrice: salePrice || price,
        maxPrice: salePrice || price,
        sold: v.orderItems?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0,
        stock: 0,
        totalStock: 0,
        availableStock: 0,
        image: v.image?.url || p.productImages?.[0]?.image?.url || null,
        status: v.statusName,
        rating: p.rating || 0,
        createdAt: v.createdAt
      };
    };

    const banners = [
      { id: '1', title: "Discover Your Best Skin", subtitle: "Shop Our Latest Essentials", image: "https://media.hcdn.vn/hsk/17722580881772247996290-1772247502337-l-e1-bb-8ach-s-c4-82n-sale-th-c3-81ng-3-home-846x250.jpg" },
      { id: '2', title: "Glow Naturally", subtitle: "Premium Skincare Collection", image: "https://media.hcdn.vn/hsk/17728610101772792156902-homecogia.jpg" },
      { id: '3', title: "Skincare Essentials", subtitle: "Top-rated Beauty Products", image: "https://media.hcdn.vn/hsk/17728619011772620603224-homecogia.jpg" }
    ];

    return {
      banners,
      // Fix Category mapping
      categories: categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: (c as any).description || null,
        imageId: c.imageId,
        image: c.image ? { id: c.image.id, url: c.image.url } : null,
        createdAt: (c as any).createdAt,
        updatedAt: (c as any).updatedAt,
        categoryGroupId: (c as any).categoryGroupId || null,
        categoryGroup: (c as any).categoryGroup ? {
            id: (c as any).categoryGroup.id,
            name: (c as any).categoryGroup.name,
            slug: (c as any).categoryGroup.slug
        } : null
      })),
      trendingProducts: trending.map(mapVariant).sort((a, b) => b.sold - a.sold),
      bestSellingProducts: bestSelling.map(mapVariant).sort((a, b) => b.sold - a.sold),
      newestProducts: newArrivals.map(mapVariant),
      flashSaleProducts: flashSale.map(mapVariant),
      brands: brands.map((b: any) => ({
        id: b.id,
        name: b.name,
        slug: b.slug,
        description: b.description || null,
        logo: b.logo ? { id: b.logo.id, url: b.logo.url } : null,
        banner: b.banner ? { id: b.banner.id, url: b.banner.url } : null,
        createdAt: b.createdAt,
        updatedAt: b.updatedAt
      }))
    };
  }
}