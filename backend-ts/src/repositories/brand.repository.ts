import { prisma } from "../config/prisma";
import { Brand } from "@prisma/client";

export class BrandRepository {
  async findAll(): Promise<Brand[]> {
    return prisma.brand.findMany({
      orderBy: { name: 'asc' }
    });
  }
}
