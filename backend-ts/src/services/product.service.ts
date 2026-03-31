import { Product } from "@prisma/client";
import { prisma } from "../config/prisma";
import { IProductRepository } from "../interfaces/IProductRepository";
import { IProductService } from "../interfaces/IProductService";
import { InventoryService } from "./inventory.service";
import { uploadFiles, uploadBase64Files } from "../utils/fileHandler";
import { CreateProductDTO } from "../DTO/product/input/AddProductDTO";

export class ProductService implements IProductService {
  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }
  
  private readonly inventoryService = new InventoryService();

  async getProducts(page: number, limit: number, flatten: boolean = false, brandId?: string): Promise<{ products: any[]; total: number }> {
    if (flatten) {
      const allProducts = await this.productRepository.findAllUnpaginated();
      let filteredProducts = allProducts;
      if (brandId) {
        filteredProducts = allProducts.filter((p: any) => p.brandId === brandId);
      }
      const mappedAll: any[] = [];
      filteredProducts.forEach((p: any) => {
        if (p.variants && p.variants.length > 0) {
          p.variants.forEach((v: any) => {
            const variantName = [p.name, v.color, v.size].filter(Boolean).join(' - ');
            mappedAll.push({
              id: p.id,
              slug: p.slug,
              variantId: v.id,
              name: variantName,
              brand: p.brand?.name || null,
              category: p.category?.name || "Chưa phân loại",
              price: v.price || p.price,
              salePrice: v.salePrice || p.salePrice || null,
              rating: p.rating,
              sold: v.orderItems?.reduce((sum: any, item: any) => sum + item.quantity, 0) || 0,
              stock: 0, // TODO: Calculate from Batches
              image: v.image?.url || p.productImages?.[0]?.image?.url || null,
              status: v.statusName || "NEW"
            });
          });
        } else {
          mappedAll.push({
            id: p.id,
            slug: p.slug,
            name: p.name,
            brand: p.brand?.name || null,
            category: p.category?.name || "Chưa phân loại",
            price: p.price,
            salePrice: p.salePrice || null,
            rating: p.rating,
            sold: p.sold,
            stock: 0,
            image: p.productImages?.[0]?.image?.url || null,
            status: "NEW"
          });
        }
      });
      const totalVariants = mappedAll.length;
      const startIndex = (page - 1) * limit;
      const paginatedProducts = mappedAll.slice(startIndex, startIndex + limit);
      return { products: paginatedProducts, total: totalVariants };
    }

    const { products, total } = await this.productRepository.findAll(page, limit, brandId);
    
    const statusMap: any = {
      'NEW': 'Mới ra mắt',
      'BEST_SELLING': 'Bán chạy',
      'TRENDING': 'Xu hướng'
    };

    const mappedProducts: any[] = [];

    products.forEach((p: any) => {
      const variantsList = p.variants || [];
      const totalStock = 0; // TODO: Calculate from Batches
      const prices = variantsList.map((v: any) => v.salePrice || v.price);
      let minPrice = p.salePrice || p.price;
      let maxPrice = p.salePrice || p.price;
      if (prices.length > 0) {
          minPrice = Math.min(...prices);
          maxPrice = Math.max(...prices);
      }
      const formatVND = (val: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
      const priceString = minPrice === maxPrice ? formatVND(minPrice) : `${formatVND(minPrice)} - ${formatVND(maxPrice)}`;
      const statusMap: any = { ACTIVE: "Đang bán", HIDDEN: "Đã ẩn", STOPPED: "Ngừng bán" };

      mappedProducts.push({
        id: p.id,
        slug: p.slug,
        name: p.name,
        brand: p.brand?.name || null,
        category: p.category?.name || "Chưa phân loại",
        priceRange: priceString,
        price: minPrice,
        salePrice: maxPrice,
        rating: p.rating,
        sold: (p.variants || []).reduce((total: number, v: any) => {
          return total + (v.orderItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0);
        }, 0),
        stock: totalStock,
        image: p.productImages?.[0]?.image?.url || p.variants?.[0]?.image?.url || null,
        status: statusMap[p.status] || "Đang bán",
        variants: variantsList.map((v: any) => ({
          id: v.id,
          sku: v.sku || `SKU-${v.id.substring(0, 8)}`,
          color: v.color,
          size: v.size,
          price: v.price,
          salePrice: v.salePrice,
          costPrice: v.costPrice || (v.price * 0.7), // Fallback if costPrice is missing
        }))
      });
    });

    return { products: mappedProducts, total };
  }

  async getVariants(page: number, limit: number): Promise<{ variants: any[]; total: number }> {
    const { variants, total } = await this.productRepository.getVariants(page, limit);
    const mappedVariants: any[] = [];

    variants.forEach((v: any) => {
      const p = v.product;
      const variantName = [p.name, v.color, v.size].filter(Boolean).join(' - ');
      mappedVariants.push({
        id: v.id,
        slug: p?.slug || "",
        productId: p?.id || "",
        name: variantName,
        brand: p?.brand?.name || null,
        category: p?.category?.name || "Chưa phân loại",
        price: v.price,
        salePrice: v.salePrice || null,
        soldCount: v.orderItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
        stock: 0, // TODO: Calculate from Batches
        image: v.image?.url || p?.productImages?.[0]?.image?.url || null,
        status: v.statusName || "NEW"
      });
    });

    return { variants: mappedVariants, total };
  }

  async getProductById(id: string): Promise<any | null> {
    const product = await this.productRepository.findById(id);
    if (!product) return null;

    const images = (product as any).productImages?.map((pi: any) => pi.image?.url) || [];
    if (images.length === 0 && (product as any).variants?.[0]?.image?.url) {
       images.push((product as any).variants[0].image.url);
    }

    const variantIds = (product as any).variants?.map((v: any) => v.id) || [];
    const stockMap = await this.inventoryService.getStockForVariants(variantIds);

    const variants = (product as any).variants?.map((v: any) => ({
      id: v.id,
      sku: v.sku || `SKU-${v.id.substring(0, 8)}`,
      color: v.color,
      size: v.size,
      price: v.price,
      salePrice: v.salePrice,
      stock: stockMap[v.id] || 0,
      image: v.image?.url || null,
      soldCount: v.orderItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0,
    })) || [];

    const prices = variants.map((v: any) => v.price);
    const salePrices = variants.map((v: any) => v.salePrice).filter((p: number | null) => p != null);
    const allPrices = [...prices, ...salePrices];
    const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : product.price;
    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : product.price;

    const totalStock = variants.reduce((sum: number, v: any) => sum + v.stock, 0);
    const totalSold = variants.reduce((sum: number, v: any) => sum + v.soldCount, 0);
    const commentCount = (product as any).reviews?.filter((r: any) => r.comment && r.comment.trim() !== '').length || 0;

    const statusMap: any = { ACTIVE: "Đang bán", HIDDEN: "Đã ẩn", STOPPED: "Ngừng bán" };

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: (product as any).brand?.name || "Unknown",
      brandId: product.brandId,
      category: (product as any).category?.name || "Chưa phân loại",
      categoryId: product.categoryId,
      status: statusMap[product.status] || "Đang bán",
      description: product.long_description || "",
      shortdescription: product.short_description || "",
      images,
      rating: product.rating,
      reviewCount: (product as any).reviews?.length || 0,
      commentCount,
      sold: totalSold,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
      totalStock,
      variants,
      specifications: product.specifications || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async createProduct(data: CreateProductDTO): Promise<Product> {
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    let dto = { ...data, slug };
    
    // Dynamically resolve Brand ID if it's passed as a plain-text name from the Frontend enum
    if (dto.brandId && !dto.brandId.includes('-')) {
      const brand = await prisma.brand.findFirst({ where: { name: { equals: dto.brandId, mode: 'insensitive' } } });
      if (brand) {
        dto.brandId = brand.id;
      } else {
        // Fallback: create brand if it doesn't exist to prevent crashes
        const newBrand = await prisma.brand.create({ data: { name: dto.brandId, slug: dto.brandId.toLowerCase().replace(/ /g, '-') } });
        dto.brandId = newBrand.id;
      }
    }

    // Dynamically resolve Category ID if it's passed as a plain-text name
    if (dto.categoryId && !dto.categoryId.includes('-')) {
      const category = await prisma.category.findFirst({ where: { name: { equals: dto.categoryId, mode: 'insensitive' } } });
      if (category) {
        dto.categoryId = category.id;
      } else {
        // Fallback: create category if it doesn't exist
        const newCategory = await prisma.category.create({ data: { name: dto.categoryId, slug: dto.categoryId.toLowerCase().replace(/ /g, '-') } });
        dto.categoryId = newCategory.id;
      }
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      throw new Error(`Product with slug ${slug} already exists`);
    }

    const imageIds: string[] = [];
    if (dto.newProductImages && dto.newProductImages.length > 0) {
      const uploaded = await uploadFiles(dto.newProductImages, "products");
      for (const file of uploaded) {
        const image = await prisma.image.create({ data: { url: file.url } });
        imageIds.push(image.id);
      }
    } else if (dto.images && dto.images.length > 0) {
      // Images could be base64 from the frontend thumbUrl
      const uploaded = await uploadBase64Files(dto.images, "products");
      for (const file of uploaded) {
        const image = await prisma.image.create({ data: { url: file.url } });
        imageIds.push(image.id);
      }
    }

    if (dto.variants && dto.variants.length > 0) {
      for (const variant of dto.variants) {
        if (variant.newImages && variant.newImages.length > 0) {
           const uploaded = await uploadFiles(variant.newImages, "variants");
           const image = await prisma.image.create({ data: { url: uploaded[0].url }}); 
           variant.imageId = image.id;
        } else if (variant.imageUrl) {
           const uploaded = await uploadBase64Files([variant.imageUrl], "variants");
           const image = await prisma.image.create({ data: { url: uploaded[0].url }});
           variant.imageId = image.id;
        }
      }
    }

    return this.productRepository.createWithTransactions({
       ...dto,
       imageIds,
    });
  }

  async updateProduct(id: string, data: any): Promise<Product> {
    return this.productRepository.update(id, data);
  }

  async deleteProduct(id: string): Promise<void> {
    await this.productRepository.delete(id);
  }

  async createVariant(data: any): Promise<any> {
    return this.productRepository.createVariant(data);
  }

  async updateVariant(id: string, data: any): Promise<any> {
    return this.productRepository.updateVariant(id, data);
  }
}
