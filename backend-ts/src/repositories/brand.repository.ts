import { prisma } from "../config/prisma";
import { Brand, Prisma } from "@prisma/client";

export class BrandRepository {
  async findAll(skip?: number, take?: number, filters?: { searchTerm?: string; minimal?: boolean; sortBy?: string; mediaStatus?: string }): Promise<[Brand[], number]> {
    const where: any = {};
    
    if (filters?.searchTerm) {
      where.OR = [
        { name: { contains: filters.searchTerm, mode: 'insensitive' } },
        { slug: { contains: filters.searchTerm, mode: 'insensitive' } },
        { email: { contains: filters.searchTerm, mode: 'insensitive' } },
        { phone: { contains: filters.searchTerm, mode: 'insensitive' } },
      ];
    }

    switch (filters?.mediaStatus) {
      case "with_logo":
        where.logoId = { not: null };
        break;
      case "without_logo":
        where.logoId = null;
        break;
      case "with_banner":
        where.bannerId = { not: null };
        break;
      case "without_banner":
        where.bannerId = null;
        break;
    }

    const include = filters?.minimal ? undefined : { logo: true, banner: true };
    const orderBy = (() => {
      switch (filters?.sortBy) {
        case 'oldest':
          return [{ createdAt: 'asc' }, { id: 'asc' }];
        case 'name_asc':
          return [{ name: 'asc' }, { id: 'asc' }];
        case 'name_desc':
          return [{ name: 'desc' }, { id: 'desc' }];
        case 'newest':
        default:
          return [{ createdAt: 'desc' }, { id: 'desc' }];
      }
    })();

    return Promise.all([
      prisma.brand.findMany({
        where,
        skip,
        take,
        include,
        orderBy
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
    try {
      return await prisma.brand.delete({
        where: { id }
      });
    } catch (error: unknown) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2003") {
          throw new Error("Không thể xóa nhà cung cấp vì đang được sử dụng trong phiếu nhập hàng. Vui lòng gỡ liên kết hoặc chuyển dữ liệu trước khi xóa.");
        }
        if (error.code === "P2025") {
          throw new Error("Nhà cung cấp không tồn tại hoặc đã bị xóa.");
        }
      }
      throw error;
    }
  }
}

