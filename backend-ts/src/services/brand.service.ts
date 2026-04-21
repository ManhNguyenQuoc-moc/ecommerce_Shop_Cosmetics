import { Brand } from "@prisma/client";
import { BrandRepository } from "../repositories/brand.repository";

type BrandQueryFilters = {
  searchTerm?: string;
  minimal?: boolean;
  sortBy?: string;
  mediaStatus?: string;
};

type BrandInput = {
  name: string;
  description?: string;
  email?: string;
  phone?: string;
  address?: string;
  slug?: string;
  logo?: { url: string };
  banner?: { url: string };
};

export class BrandService {
  constructor(private readonly brandRepository: BrandRepository = new BrandRepository()) {}

  async getAllBrands(page?: number, limit?: number, filters?: BrandQueryFilters): Promise<{ items: Brand[], total: number }> {
    const skip = page && limit ? (page - 1) * limit : undefined;
    const [items, total] = await this.brandRepository.findAll(skip, limit, filters);
    return { items, total };
  }

  async getBrandById(id: string): Promise<Brand | null> {
    return this.brandRepository.findById(id);
  }

  async createBrand(data: BrandInput): Promise<Brand> {
    if (!data.slug && data.name) {
      data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return this.brandRepository.create(data);
  }

  async updateBrand(id: string, data: BrandInput): Promise<Brand> {
    if (data.name && !data.slug) {
       data.slug = data.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }
    return this.brandRepository.update(id, data);
  }

  async deleteBrand(id: string): Promise<Brand> {
    return this.brandRepository.delete(id);
  }
}

