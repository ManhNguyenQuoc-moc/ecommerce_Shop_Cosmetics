import { Wishlist } from "@prisma/client";
import { IWishlistRepository } from "../interfaces/IWishlistRepository";
import { prisma } from "../config/prisma";

export class WishlistRepository implements IWishlistRepository {
  async findByUserId(userId: string): Promise<any[]> {
    return prisma.wishlist.findMany({
      where: { userId },
      include: {
        variant: {
          include: {
            product: {
              include: {
                brand: true,
                productImages: { include: { image: true }, orderBy: { order: 'asc' } }
              }
            },
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async addItem(userId: string, variantId: string): Promise<Wishlist> {
    return prisma.wishlist.create({
      data: {
        userId,
        variantId
      }
    });
  }

  async removeItem(userId: string, variantId: string): Promise<void> {
    await prisma.wishlist.delete({
      where: {
        userId_variantId: {
          userId,
          variantId
        }
      }
    });
  }

  async exists(userId: string, variantId: string): Promise<boolean> {
    const count = await prisma.wishlist.count({
      where: {
        userId,
        variantId
      }
    });
    return count > 0;
  }
}
