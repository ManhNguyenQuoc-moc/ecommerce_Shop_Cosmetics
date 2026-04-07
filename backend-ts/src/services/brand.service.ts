import { BrandRepository } from "../repositories/brand.repository";
// Workaround for Prisma type export issues
type Brand = any;

export class BrandService {
  constructor(private readonly brandRepository: BrandRepository = new BrandRepository()) {}

  async getAllBrands(page?: number, limit?: number): Promise<{ items: Brand[], total: number }> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const [items, total] = await this.brandRepository.findAll(skip, limit);
    return { items, total };
  }

  async getBrandById(id: string): Promise<Brand | null> {
    return this.brandRepository.findById(id);
  }

  async createBrand(data: any): Promise<Brand> {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return this.brandRepository.create(data);
  }

  async updateBrand(id: string, data: any): Promise<Brand> {
    if (data.name && !data.slug) {
       data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return this.brandRepository.update(id, data);
  }

  async deleteBrand(id: string): Promise<Brand> {
    return this.brandRepository.delete(id);
  }
}

