import { BrandRepository } from "../repositories/brand.repository";
import { Brand } from "@prisma/client";

export class BrandService {
  constructor(private readonly brandRepository: BrandRepository = new BrandRepository()) {}

  async getAllBrands(): Promise<Brand[]> {
    return this.brandRepository.findAll();
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

