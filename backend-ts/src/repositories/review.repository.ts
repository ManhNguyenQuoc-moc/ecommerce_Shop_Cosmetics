import { prisma } from "../config/prisma";
import { Review, Sentiment } from "@prisma/client";

export class ReviewRepository {
  async create(data: {
    userId: string;
    productId: string;
    rating: number;
    comment?: string;
    sentiment?: Sentiment;
    parentId?: string;
  }): Promise<any> {
    return prisma.review.create({
      data,
      include: {
        user: {
          select: {
            full_name: true,
            avatar: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    }) as any;
  }

  async findByProductId(productId: string): Promise<any[]> {
    return prisma.review.findMany({
      where: {
        productId,
        parentId: null, // Only top-level reviews
      },
      include: {
        user: {
          select: {
            full_name: true,
            avatar: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                full_name: true,
                avatar: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<any> {
    return prisma.review.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            full_name: true,
            avatar: true,
          },
        },
        product: {
          select: {
            name: true,
          },
        },
      },
    });
  }
  
  async delete(id: string): Promise<Review> {
    return prisma.review.delete({
      where: { id },
    });
  }

  async updateStatus(id: string, status: any): Promise<any> {
    return prisma.review.update({
      where: { id },
      data: { status } as any,
      include: {
        user: { select: { full_name: true, avatar: true } },
        product: { select: { name: true } },
        replies: { include: { user: { select: { full_name: true, avatar: true } } } },
      },
    });
  }
}
