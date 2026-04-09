import { prisma } from "../config/prisma";
import { Brand } from "@prisma/client";

export class BrandRepository {
  async findAll(skip?: number, take?: number, filters?: { searchTerm?: string; minimal?: boolean }): Promise<[Brand[], number]> {
    const where: any = {};
    
    if (filters?.searchTerm) {
      where.OR = [
        { name: { contains: filters.searchTerm, mode: 'insensitive' } },
        { slug: { contains: filters.searchTerm, mode: 'insensitive' } },
      ];
    }

    const include = filters?.minimal ? undefined : { logo: true, banner: true };

    return Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take,
        include,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
      }),
      prisma.brand.count({ where })
    ]);
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

