import { prisma } from "../config/prisma";
import { Question } from "@prisma/client";

export class QuestionRepository {
  async create(data: {
    productId: string;
    userId?: string | null;
    content: string;
    parentId?: string | null;
  }): Promise<any> {
    return prisma.question.create({
      data,
      include: {
        user: {
          select: {
            full_name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async findByProductId(productId: string): Promise<any[]> {
    return prisma.question.findMany({
      where: {
        productId,
        parentId: null, // Only root-level questions
      },
      include: {
        user: {
          select: {
            full_name: true,
            avatar: true,
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
            replies: {
              include: {
                user: {
                  select: {
                    full_name: true,
                    avatar: true,
                  },
                },
              },
              orderBy: { createdAt: "asc" },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findById(id: string): Promise<any> {
    return prisma.question.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            full_name: true,
            avatar: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: any): Promise<any> {
    return prisma.question.update({
      where: { id },
      data: { status } as any,
    });
  }

  async delete(id: string): Promise<any> {
    return prisma.question.delete({
      where: { id },
    });
  }
}
