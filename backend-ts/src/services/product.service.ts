import { Product } from "@prisma/client";
import { prisma } from "../config/prisma";
import { IProductRepository, ProductQueryFilters } from "../interfaces/IProductRepository";
import { IProductService } from "../interfaces/IProductService";
import { InventoryService } from "./inventory.service";
import { uploadFiles, uploadBase64Files } from "../utils/fileHandler";
import { CreateProductDTO } from "../DTO/product/input/AddProductDTO";
import { ProductMapper } from "../mapper/product.mapper";
import { ProductListItemDto } from "../DTO/product/output/ProductListItemDto";
import { PagedResult } from "../common/paged-result";

export class ProductService implements IProductService {

  private readonly productRepository: IProductRepository;

  constructor(productRepository: IProductRepository) {
    this.productRepository = productRepository;
  }
  
  private readonly inventoryService = new InventoryService();

async getProducts(
  page: number,
  pageSize: number,
  flatten: boolean = false,
  filters?: ProductQueryFilters
): Promise<PagedResult<ProductListItemDto>> {

  if (flatten) {
    const allProducts = await this.productRepository.findAllUnpaginated();

    const filtered = filters?.brandId
      ? allProducts.filter((p) => p.brandId === filters.brandId)
      : allProducts;

    const mapped = filtered.flatMap(ProductMapper.toFlatten);

    const total = mapped.length;
    const start = (page - 1) * pageSize;

    return {
      data: mapped.slice(start, start + pageSize),
      total,
      page,
      pageSize
    };
  }

  const { products, total } = await this.productRepository.findAll(
    page,
    pageSize,
    filters
  );

  const mapped = products.map(ProductMapper.toList);

  return {
    data: mapped,
    total,
    page,
    pageSize
  };
}

  async getVariants(page: number, pageSize: number, status?: string): Promise<{ variants: any[]; total: number }> {
    const { variants, total } = await this.productRepository.getVariants(page, pageSize, status);
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
        stock: 0,
        image: v.image?.url || p?.productImages?.[0]?.image?.url || null,
        status: v.statusName || "NEW",
        productStatus: p?.status || "ACTIVE"
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
      imageId: v.imageId || null,
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
      statusRaw: product.status, // raw enum for form selects
      description: product.long_description || "",
      shortdescription: product.short_description || "",
      images,
      productImages: (product as any).productImages || [],
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

  async updateProduct(id: string, data: any): Promise<any> {
    const newImageIds: string[] = [];

    // Upload any new product images
    if (data.newImages && data.newImages.length > 0) {
      const uploaded = await uploadBase64Files(data.newImages, 'products');
      for (const file of uploaded) {
        const img = await prisma.image.create({ data: { url: file.url } });
        newImageIds.push(img.id);
      }
    }

    // Upload new variant images
    if (data.variants) {
      for (const variant of data.variants) {
        // Only process if there's an imageUrl
        if (variant.imageUrl) {
          // If it's already a URL and we don't have an imageId, try to find or create the Image record
          if (!variant.imageId) {
            const existingImage = await prisma.image.findFirst({ where: { url: variant.imageUrl } });
            if (existingImage) {
              variant.imageId = existingImage.id;
            } else {
              // If it's a URL but not in our DB, just create the record
              if (typeof variant.imageUrl === 'string' && variant.imageUrl.startsWith("http")) {
                const img = await prisma.image.create({ data: { url: variant.imageUrl } });
                variant.imageId = img.id;
              } else {
                // Otherwise treat as base64/file and upload
                const uploaded = await uploadBase64Files([variant.imageUrl], 'variants');
                const img = await prisma.image.create({ data: { url: uploaded[0].url } });
                variant.imageId = img.id;
              }
            }
          }
        } else if (variant.imageId === null || variant.imageUrl === null) {
          // Explicitly set to null for removal handled by repository
          variant.imageId = null;
        }
      }
    }

    return this.productRepository.updateWithTransactions(id, {
      ...data,
      newImageIds,
    });
  }

  async softDeleteProducts(ids: string[]): Promise<void> {
    await this.productRepository.softDeleteProducts(ids);
  }

  async restoreProducts(ids: string[]): Promise<void> {
    await this.productRepository.restoreProducts(ids);
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

  async softDeleteVariants(ids: string[]): Promise<void> {
    await this.productRepository.softDeleteVariants(ids);
  }

  async restoreVariants(ids: string[]): Promise<void> {
    await this.productRepository.restoreVariants(ids);
  }
}
