import { ProductListItemDto } from "../DTO/product/output/ProductListItemDto";
export class ProductMapper {

  static toFlatten(p: any): ProductListItemDto[] {
    if (!p.variants || p.variants.length === 0) {
      return [{
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand ? { id: p.brand.id, name: p.brand.name } : null,
        category: p.category ? { id: p.category.id, name: p.category.name } : null,
        image: p.productImages?.[0]?.image?.url || null,
        price: p.price,
        salePrice: p.salePrice || null,
        sold: p.sold || 0,
        stock: p.totalStock || 0,
        totalStock: p.totalStock || 0,
        availableStock: p.availableStock || 0,
        status: "NEW",
        rating: p.rating || 0,
        createdAt: p.createdAt
      }];
    }

    return p.variants.map((v: any) => ({
      id: p.id,
      slug: p.slug,
      variantId: v.id,
      name: [p.name, v.color, v.size].filter(Boolean).join(" - "),
      brand: p.brand ? { id: p.brand.id, name: p.brand.name } : null,
      category: p.category ? { id: p.category.id, name: p.category.name } : null,
      image: v.image?.url || p.productImages?.[0]?.image?.url || null,
      price: v.price || p.price,
      salePrice: v.salePrice || p.salePrice || null,
      sold: v.sold || 0,
      stock: v.totalStock || 0,
      totalStock: v.totalStock || 0,
      availableStock: v.availableStock || 0,
      status: v.statusName || "NEW",
      rating: p.rating || 0,
      createdAt: v.createdAt || p.createdAt
    }));
  }

  static toList(p: any): ProductListItemDto {
    const variants = p.variants || [];

    const prices = variants.map((v: any) => v.salePrice || v.price);
    const minPrice = prices.length ? Math.min(...prices) : p.price;
    const maxPrice = prices.length ? Math.max(...prices) : p.price;

    return {
      id: p.id,
      slug: p.slug,
      name: p.name,
      brand: p.brand ? { id: p.brand.id, name: p.brand.name } : null,
      category: p.category ? { id: p.category.id, name: p.category.name } : null,
      image: p.productImages?.[0]?.image?.url || p.variants?.[0]?.image?.url || null,

      price: minPrice,
      salePrice: maxPrice,

      minPrice,
      maxPrice,

      sold: p.sold || 0,

      stock: p.totalStock || 0,
      totalStock: p.totalStock || 0,
      availableStock: p.availableStock || 0,
      status: p.status,
      rating: p.rating || 0,
      createdAt: p.createdAt
    };
  }
}