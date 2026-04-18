import { prisma } from "../config/prisma";
import { Notification, NotificationType } from "@prisma/client";

export class NotificationRepository {
  async create(data: {
    userId?: string;
    title: string;
    content: string;
    type: NotificationType;
    metadata?: any;
  }): Promise<Notification> {
    return prisma.notification.create({
      data,
    });
  }

  async findMany(userId?: string): Promise<Notification[]> {
    return prisma.notification.findMany({
      where: userId ? { userId } : {},
      orderBy: { createdAt: "desc" },
      take: 50,
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    return prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId?: string): Promise<any> {
    return prisma.notification.updateMany({
      where: userId ? { userId } : {},
      data: { isRead: true },
    });
  }
}
