import { Product } from "@prisma/client";
import { IProductRepository } from "../interfaces/IProductRepository";
import { IProductService } from "../interfaces/IProductService";

export class ProductService implements IProductService {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }

  async getProducts(page: number, limit: number): Promise<{ products: any[]; total: number }> {
    const { products, total } = await this.productRepository.findAll(page, limit);
    const mappedProducts = products.map((p: any) => ({
      id: p.id,
      name: p.name,
      brand: p.brand?.name || null,
      price: p.price,
      salePrice: p.salePrice,
      rating: p.rating,
      sold: p.sold,
      image: p.productImages?.[0]?.image?.url || p.variants?.[0]?.image?.url || null
    }));
    return { products: mappedProducts, total };
  }

  async getProductById(id: string): Promise<any | null> {
    const product = await this.productRepository.findById(id);
    if (!product) return null;

    const images = (product as any).productImages?.map((pi: any) => pi.image?.url) || [];
    if (images.length === 0 && (product as any).variants?.[0]?.image?.url) {
       images.push((product as any).variants[0].image.url);
    }

    const variants = (product as any).variants?.map((v: any) => ({
      id: v.id,
      color: v.color,
      size: v.size,
      price: v.price,
      salePrice: v.salePrice,
      stock: v.stock_quantity,
      image: v.image?.url || null
    })) || [];

    const prices = variants.map((v: any) => v.price);
    const salePrices = variants.map((v: any) => v.salePrice).filter((p: number | null) => p != null);
    const allPrices = [...prices, ...salePrices];
    const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : product.price;
    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : product.price;

    const totalStock = variants.reduce((sum: number, v: any) => sum + v.stock, 0);

    return {
      id: product.id,
      name: product.name,
      brand: (product as any).brand?.name || "Unknown",
      description: product.long_description || "",
      shortdescription: product.short_description || "",
      images,
      rating: product.rating,
      reviewCount: (product as any).reviews?.length || 0,
      sold: product.sold,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
      totalStock,
      variants,
      specifications: product.specifications || [],
    };
  }

  async createProduct(data: any): Promise<Product> {
    return this.productRepository.create(data);
  }

  async updateProduct(id: string, data: any): Promise<Product> {
    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    return this.productRepository.delete(id);
  }
}
