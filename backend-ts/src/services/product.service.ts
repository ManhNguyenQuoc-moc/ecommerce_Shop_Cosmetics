import { ProductVariantRawResult, VariantQueryFilters, ProductQueryFilters } from "../interfaces/IProductRepository";
import { IProductRepository } from "../interfaces/IProductRepository";
import { PagedResult } from "../common/paged-result";
import { ProductListItemDto } from "../DTO/product/output/ProductListItemDto";
import { InventoryService } from "./inventory.service";

// Workaround for Prisma type export issues
type Product = any;
type ProductVariant = any;
const Prisma: any = {};
import { prisma } from "../config/prisma";
import { IProductService } from "../interfaces/IProductService";
import { CreateProductDTO, CreateVariantDTO } from "../DTO/product/input/AddProductDTO";
import { UpdateProductDTO, UpdateVariantDTO } from "../DTO/product/input/UpdateProductDTO";
import { ProductMapper } from "../mapper/product.mapper";
import { VariantDetailDto } from "../DTO/product/output/VariantDetailDto";
import { VariantListItemDto } from "../DTO/product/output/VariantListItemDto";

export class ProductService implements IProductService {
  async getVariantById(id: string): Promise<VariantDetailDto | null> {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            productImages: {
               include: {
                 image: true
               }
            }
          }
        },
        image: true
      }
    });

    if (!variant) return null;

    const batches = await prisma.batch.findMany({
      where: { variantId: id },
      include: {
        transactions: true,
        purchaseOrder: {
          select: { code: true }
        }
      },
      orderBy: { expiryDate: 'asc' }
    });

    const statusMap: Record<string, string> = { ACTIVE: "Đang bán", HIDDEN: "Đã ẩn", STOPPED: "Ngừng bán" };
    const images = variant.product.productImages?.map((pi: any) => pi.image?.url) || [];
    
    return {
      id: variant.id,
      productId: variant.productId,
      product: {
        id: variant.product.id,
        name: variant.product.name,
        slug: variant.product.slug
      },
      color: variant.color,
      size: variant.size,
      sku: variant.sku,
      price: variant.price,
      salePrice: variant.salePrice,
      stock: batches.reduce((sum: number, b: any) => sum + b.quantity, 0),
      image: variant.image?.url || images[0] || null,
      imageId: variant.imageId,
      sold: variant.sold || 0,
      statusName: variant.statusName,
      status: statusMap[variant.status] || "Đang bán",
      statusRaw: variant.status,
      batches: batches.map((b: any) => {
        const totalIn = b.transactions
          .filter((t: any) => t.type === 'IN')
          .reduce((sum: number, t: any) => sum + t.quantity, 0);
        
        const totalOut = b.transactions
          .filter((t: any) => t.type === 'OUT')
          .reduce((sum: number, t: any) => sum + Math.abs(t.quantity), 0);

        return {
          id: b.id,
          batchNumber: b.batchNumber,
          purchaseOrderCode: b.purchaseOrder?.code || null,
          expiryDate: b.expiryDate,
          manufacturingDate: b.manufacturingDate,
          quantity: b.quantity,
          costPrice: b.costPrice,
          totalIn,
          totalOut,
          createdAt: b.createdAt
        };
      }),
      createdAt: variant.createdAt,
      updatedAt: variant.updatedAt
    };
  }

  async getVariantBatches(variantId: string, page: number, pageSize: number): Promise<PagedResult<any>> {
    const skip = (page - 1) * pageSize;
    const [batches, total] = await Promise.all([
      prisma.batch.findMany({
        where: { variantId },
        include: { 
          transactions: true,
          purchaseOrder: {
            select: { code: true }
          }
        },
        orderBy: { expiryDate: 'asc' },
        skip,
        take: pageSize
      }),
      prisma.batch.count({ where: { variantId } })
    ]);

    return {
      data: batches.map((b: any) => {
        const totalIn = b.transactions
          .filter((t: any) => t.type === 'IN')
          .reduce((sum: number, t: any) => sum + t.quantity, 0);
        
        const totalOut = b.transactions
          .filter((t: any) => t.type === 'OUT')
          .reduce((sum: number, t: any) => sum + Math.abs(t.quantity), 0);

        return {
          id: b.id,
          batchNumber: b.batchNumber,
          purchaseOrderCode: b.purchaseOrder?.code || null,
          expiryDate: b.expiryDate,
          manufacturingDate: b.manufacturingDate,
          quantity: b.quantity,
          costPrice: b.costPrice,
          totalIn,
          totalOut,
          createdAt: b.createdAt
        };
      }),
      total,
      page,
      pageSize
    };
  }

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
      const variantFilters: VariantQueryFilters = {
        searchTerm: filters?.searchTerm,
        categoryId: filters?.categoryId,
        categorySlug: filters?.categorySlug,
        brandId: filters?.brandId,
        sortBy: filters?.sortBy,
        status: filters?.status === 'active_tab' ? 'ACTIVE' : filters?.status,
        minPrice: filters?.minPrice,
        maxPrice: filters?.maxPrice,
        isSale: filters?.isSale,
        rating: filters?.rating,
      };

      const { variants, total } = await this.productRepository.getVariants(
        page,
        pageSize,
        variantFilters
      );

      const variantIds = variants.map((v) => v.id);
      const stockMap = await this.inventoryService.getStockForVariants(variantIds);

      const mapped = variants.map((v: ProductVariantRawResult) => {
        const p = v.product;
        const variantName = [p.name, v.color, v.size].filter(Boolean).join(' - ');
        return {
          id: p.id,
          slug: p.slug,
          variantId: v.id,
          name: variantName,
          brand: p.brand ? { id: p.brand.id, name: p.brand.name } : null,
          category: p.category ? { id: p.category.id, name: p.category.name } : null,
          price: v.price || p.price,
          salePrice: v.salePrice || null,
          sold: v.sold || 0,
          stock: stockMap[v.id]?.totalStock || 0,
          totalStock: stockMap[v.id]?.totalStock || 0,
          availableStock: stockMap[v.id]?.availableStock || 0,
          image: v.variantImageUrl || v.productImageUrl || null,
          status: v.statusName || "NEW",
          rating: (p as any).rating || 0,
          createdAt: v.createdAt || p.createdAt
        };
      });

      return {
        data: mapped,
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

  async getVariants(page: number, pageSize: number, filters?: VariantQueryFilters): Promise<PagedResult<VariantListItemDto>> {
    const { variants, total } = await this.productRepository.getVariants(page, pageSize, filters);
    const mappedVariants: VariantListItemDto[] = [];
    // collect variant ids and fetch stock map
    const variantIds = variants.map((v: ProductVariantRawResult) => v.id);
    const stockMap = await this.inventoryService.getStockForVariants(variantIds);

    variants.forEach((v: ProductVariantRawResult) => {
      const p = v.product;
      const variantName = [p?.name, v.color, v.size].filter(Boolean).join(' - ');
      mappedVariants.push({
        id: v.id,
        slug: p?.slug || "",
        productId: p?.id || "",
        productName: p?.name || "",
        name: variantName,
        brand: p?.brand ? { id: p?.brand.id, name: p?.brand.name, slug: p?.brand.slug } : null,
        category: p?.category ? { id: p?.category.id, name: p?.category.name, slug: p?.category.slug } : null,
        price: v.price,
        salePrice: v.salePrice || null,
        costPrice: v.costPrice || null,
        sku: v.sku || "",
        color: v.color || "",
        size: v.size || "",
        sold: v.sold || 0,
        stock: stockMap[v.id]?.totalStock || 0,
        totalStock: stockMap[v.id]?.totalStock || 0,
        availableStock: stockMap[v.id]?.availableStock || 0,
        image: v.variantImageUrl || v.productImageUrl || null,
        status: v.status || "ACTIVE",
        productStatus: p?.status || "ACTIVE",
        statusName: v.statusName || "NEW",
        createdAt: v.createdAt,
        updatedAt: v.updatedAt
      });
    });

    return {
      data: mappedVariants,
      total,
      page,
      pageSize
    };
  }

  async getProductById(id: string): Promise<any | null> {
    const product = await this.productRepository.findById(id);
    if (!product) return null;
    const typedProduct = product as any;
    const images = typedProduct.productImages?.map((pi: any) => pi.image?.url) || [];
    if (images.length === 0 && typedProduct.variants?.[0]?.image?.url) {
       images.push(typedProduct.variants[0].image.url);
    }
    const variantIds = typedProduct.variants?.map((v: any) => v.id) || [];
    const stockMap = await this.inventoryService.getStockForVariants(variantIds);
    
    const variants = typedProduct.variants?.map((v: any) => ({
      id: v.id,
      sku: v.sku || `SKU-${v.id.substring(0, 8)}`,
      color: v.color,
      size: v.size,
      costPrice: v.costPrice || 0,
      price: v.price,
      salePrice: v.salePrice,
      stock: stockMap[v.id]?.totalStock || 0,
      totalStock: stockMap[v.id]?.totalStock || 0,
      availableStock: stockMap[v.id]?.availableStock || 0,
      image: v.image?.url || images[0] || null,
      imageId: v.imageId || null,
      sold: v.sold || 0,
      statusName: v.statusName,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt
    })) || [];

    const prices = variants.map((v: any) => v.price);
    const salePrices = variants.map((v: any) => v.salePrice).filter((p: any): p is number => p != null);
    const allPrices = [...prices, ...salePrices];
    const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : typedProduct.price;
    const maxPrice = allPrices.length > 0 ? Math.max(...allPrices) : typedProduct.price;

    const totalStock = variants.reduce((sum: number, v: any) => sum + (v.totalStock || 0), 0);
    const availableStock = variants.reduce((sum: number, v: any) => sum + (v.availableStock || 0), 0);
    const totalSold = variants.reduce((sum: number, v: any) => sum + (v.sold || 0), 0);
    const commentCount = typedProduct.reviews?.filter((r: any) => r.comment && r.comment.trim() !== '').length || 0;

    const statusMap: Record<string, string> = { ACTIVE: "Đang bán", HIDDEN: "Đã ẩn", STOPPED: "Ngừng bán" };

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: typedProduct.brand ? { id: typedProduct.brand.id, name: typedProduct.brand.name, slug: typedProduct.brand.slug } : null,
      brandId: product.brandId,
      category: typedProduct.category ? { id: typedProduct.category.id, name: typedProduct.category.name, slug: typedProduct.category.slug } : null,
      categoryId: product.categoryId,
      status: statusMap[product.status] || "Đang bán",
      statusRaw: product.status, 
      long_description: product.long_description || "",
      short_description: product.short_description || "",
      images,
      productImages: typedProduct.productImages || [],
      rating: product.rating,
      reviewCount: typedProduct.reviews?.length || 0,
      commentCount,
      sold: totalSold,
      priceRange: {
        min: minPrice,
        max: maxPrice,
      },
      totalStock,
      availableStock,
      variants,
      reviews: typedProduct.reviews?.map((r: any) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        user: {
          id: (r as any).user?.id,
          full_name: (r as any).user?.full_name
        }
      })) || [],
      specifications: product.specifications || [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  async createProduct(data: CreateProductDTO): Promise<Product> {
    const slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    
    // Resolve Brand
    if (data.brandId && !data.brandId.includes('-')) {
      const brand = await prisma.brand.findFirst({ where: { name: { equals: data.brandId, mode: 'insensitive' } } });
      if (brand) data.brandId = brand.id;
    }

    // Resolve Category
    if (data.categoryId && !data.categoryId.includes('-')) {
      const category = await prisma.category.findFirst({ where: { name: { equals: data.categoryId, mode: 'insensitive' } } });
      if (category) data.categoryId = category.id;
    }
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) throw new Error(`Product with slug ${slug} already exists`);
    const imageIds: string[] = [];
    if (data.images && data.images.length > 0) {
      for (const url of data.images) {
        const image = await prisma.image.create({ data: { url } });
        imageIds.push(image.id);
      }
    }
    if (data.variants && data.variants.length > 0) {
      for (const variant of data.variants) {
        if (variant.imageUrl) {
          const image = await prisma.image.create({ data: { url: variant.imageUrl } });
          (variant as any).imageId = image.id; // Internal property for repository
        }
      }
    }

    return this.productRepository.createWithTransactions({
       ...data,
       imageIds,
    });
  }

  async updateProduct(id: string, data: UpdateProductDTO): Promise<any> {
    const newImageIds: string[] = [];

    // Create Image records for new gallery images
    if (data.newImages && data.newImages.length > 0) {
      for (const url of data.newImages) {
        const img = await prisma.image.create({ data: { url } });
        newImageIds.push(img.id);
      }
    }

    // Create Image records for variant images
    if (data.variants) {
      for (const variant of data.variants) {
        if (variant.imageUrl && !variant.imageId) {
          // Check if image exists by URL first
          const existingImage = await prisma.image.findFirst({ where: { url: variant.imageUrl } });
          if (existingImage) {
            variant.imageId = existingImage.id;
          } else {
            const img = await prisma.image.create({ data: { url: variant.imageUrl } });
            variant.imageId = img.id;
          }
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

  async createVariant(data: CreateVariantDTO & { productId: string }): Promise<any> {
    if (data.imageUrl) {
      const img = await prisma.image.create({ data: { url: data.imageUrl } });
      (data as any).imageId = img.id;
    }
    return this.productRepository.createVariant(data);
  }

  async updateVariant(id: string, data: UpdateVariantDTO): Promise<any> {
    if (data.imageUrl && !data.imageId) {
       const img = await prisma.image.create({ data: { url: data.imageUrl } });
       data.imageId = img.id;
    }
    return this.productRepository.updateVariant(id, data);
  }

  async softDeleteVariants(ids: string[]): Promise<void> {
    await this.productRepository.softDeleteVariants(ids);
  }

  async restoreVariants(ids: string[]): Promise<void> {
    await this.productRepository.restoreVariants(ids);
  }
}
