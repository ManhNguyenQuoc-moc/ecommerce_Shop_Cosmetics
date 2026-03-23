import { BrandRepository } from "../repositories/brand.repository";
import { Brand } from "@prisma/client";

export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async getAllBrands(): Promise<Brand[]> {
    return this.brandRepository.findAll();
  }
}
