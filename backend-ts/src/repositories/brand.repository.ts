import { prisma } from "../config/prisma";
import { Brand } from "@prisma/client";

export class BrandRepository {
  async findAll(): Promise<Brand[]> {
    return prisma.brand.findMany({
      include: { logo: true, banner: true },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string): Promise<Brand | null> {
    return prisma.brand.findUnique({
      where: { id },
      include: { logo: true, banner: true }
    });
  }

  async create(data: any): Promise<Brand> {
    return prisma.brand.create({
      data,
      include: { logo: true, banner: true }
    });
  }

  async update(id: string, data: any): Promise<Brand> {
    return prisma.brand.update({
      where: { id },
      data,
      include: { logo: true, banner: true }
    });
  }

  async delete(id: string): Promise<Brand> {
    return prisma.brand.delete({
      where: { id }
    });
  }
}

