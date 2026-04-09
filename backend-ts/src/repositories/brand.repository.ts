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
    const { logo, banner, ...rest } = data;
    const createData: any = { ...rest };

    if (logo?.url) {
      createData.logo = {
        create: { url: logo.url }
      };
    }

    if (banner?.url) {
      createData.banner = {
        create: { url: banner.url }
      };
    }

    return prisma.brand.create({
      data: createData,
      include: { logo: true, banner: true }
    });
  }

  async update(id: string, data: any): Promise<Brand> {
    const { logo, banner, ...rest } = data;
    const updateData: any = { ...rest };

    if (logo?.url) {
      updateData.logo = {
        upsert: {
          create: { url: logo.url },
          update: { url: logo.url }
        }
      };
    }

    if (banner?.url) {
      updateData.banner = {
        upsert: {
          create: { url: banner.url },
          update: { url: banner.url }
        }
      };
    }

    return prisma.brand.update({
      where: { id },
      data: updateData,
      include: { logo: true, banner: true }
    });
  }

  async delete(id: string): Promise<Brand> {
    return prisma.brand.delete({
      where: { id }
    });
  }
}

