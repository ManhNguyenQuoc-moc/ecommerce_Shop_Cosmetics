import { ProductListItemDto } from "../DTO/product/output/ProductListItemDto";
export class ProductMapper {

  static toFlatten(p: any): ProductListItemDto[] {
    if (!p.variants || p.variants.length === 0) {
      return [{
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand?.name || null,
        category: p.category?.name || "Chưa phân loại",
        image: p.productImages?.[0]?.image?.url || null,
        price: p.price,
        salePrice: p.salePrice || null,
        sold: p.sold || 0,
        stock: 0,
        status: "NEW",
        createdAt: p.createdAt
      }];
    }

    return p.variants.map((v: any) => ({
      id: p.id,
      slug: p.slug,
      variantId: v.id,
      name: [p.name, v.color, v.size].filter(Boolean).join(" - "),
      brand: p.brand?.name || null,
      category: p.category?.name || "Chưa phân loại",
      image: v.image?.url || p.productImages?.[0]?.image?.url || null,
      price: v.price || p.price,
      salePrice: v.salePrice || p.salePrice || null,
      sold: v.orderItems?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0,
      stock: 0,
      status: v.statusName || "NEW",
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
      brand: p.brand?.name || null,
      category: p.category?.name || "Chưa phân loại",
      image: p.productImages?.[0]?.image?.url || p.variants?.[0]?.image?.url || null,

      price: minPrice,
      salePrice: maxPrice,

      minPrice,
      maxPrice,

      sold: variants.reduce(
        (total: number, v: any) =>
          total + (v.orderItems?.reduce((s: number, i: any) => s + i.quantity, 0) || 0),
        0
      ),

      stock: 0,
      status: p.status,
      createdAt: p.createdAt
    };
  }
}