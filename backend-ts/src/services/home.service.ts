import { IHomeService } from "../interfaces/IHomeService";
import { prisma } from "../config/prisma";

export class HomeService implements IHomeService {
  async getHomeData(): Promise<any> {
    const defaultProductInclude = {
      variants: { include: { image: true } },
      brand: true,
      productImages: { include: { image: true }, orderBy: { order: 'asc' } }
    } as any;
    const [categories, featuredProducts, bestSellingProducts, newestProducts, brands] = await Promise.all([
      prisma.category.findMany({ take: 50, include: { image: true } }),
      prisma.product.findMany({
        take: 12,
        include: defaultProductInclude
      }),
      prisma.product.findMany({
        take: 12,
        orderBy: { sold: 'desc' },
        include: defaultProductInclude
      }),
      prisma.product.findMany({
        take: 12,
        orderBy: { createdAt: 'desc' },
        include: defaultProductInclude
      }),
      prisma.brand.findMany({
        where: { logoId: { not: null } },
        take: 4,
        include: { logo: true, banner: true }
      })
    ]);

    const formatProduct = (p: any) => ({
      id: p.id,
      name: p.name,
      brand: p.brand?.name || null,
      price: p.price,
      salePrice: p.salePrice,
      rating: p.rating,
      sold: p.sold,
      image: p.productImages?.[0]?.image?.url || p.variants?.[0]?.image?.url || null
    });

    const formatCategory = (c: any) => ({
      name: c.name,
      image: c.image?.url || null
    });

    const banners = [
      { title: "Discover Your Best Skin", subtitle: "Shop Our Latest Essentials", image: "/images/main/banner.png" },
      { title: "Discover Your Best Skin", subtitle: "Shop Our Latest Essentials", image: "https://media.hcdn.vn/hsk/17722580881772247996290-1772247502337-l-e1-bb-8ach-s-c4-82n-sale-th-c3-81ng-3-home-846x250.jpg" },
      { title: "Glow Naturally", subtitle: "Premium Skincare Collection", image: "https://media.hcdn.vn/hsk/17728610101772792156902-homecogia.jpg" },
      { title: "Glow Naturally", subtitle: "Premium Skincare Collection", image: "https://media.hcdn.vn/hsk/17728619011772620603224-homecogia.jpg" },
      { title: "Glow Naturally", subtitle: "Premium Skincare Collection", image: "https://media.hcdn.vn/hsk/17728611901772791420592-846x250.jpg" },
      { title: "Glow Naturally", subtitle: "Premium Skincare Collection", image: "https://media.hcdn.vn/hsk/17728616831772705621390-homecogia.jpg" },
      { title: "Glow Naturally", subtitle: "Premium Skincare Collection", image: "https://media.hcdn.vn/hsk/17728617971772680663150-home-8.jpg" }
    ];

    return {
      banners,
      categories: categories.map(formatCategory),
      featuredProducts: featuredProducts.map(formatProduct),
      bestSellingProducts: bestSellingProducts.map(formatProduct),
      newestProducts: newestProducts.map(formatProduct),
      brands: brands.map((b: any) => ({
        name: b.name,
        logo: b.logo?.url || null,
        banner: b.banner?.url || null
      }))
    };
  }
}
