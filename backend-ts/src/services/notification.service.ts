import { NotificationRepository } from "../repositories/notification.repository";
import { CreateNotificationDto, NotificationResponseDto } from "../DTO/notification.dto";
import { socketService } from "./socket.service";

export class NotificationService {
  constructor(private notificationRepository: NotificationRepository) {}

  async createNotification(data: CreateNotificationDto): Promise<NotificationResponseDto> {
    const notification = await this.notificationRepository.create(data);

    const response: NotificationResponseDto = {
      id: notification.id,
      userId: notification.userId,
      title: notification.title,
      content: notification.content,
      type: notification.type,
      isRead: notification.isRead,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
    };

    // Push to WebSockets
    if (notification.userId) {
      // Direct notification (not implemented yet for specific users in socketService, but placeholder)
      socketService.notifyAdmin(response); // For now, all notifications go to admin room
    } else {
      socketService.notifyAdmin(response);
    }

    return response;
  }

  async getNotifications(userId?: string): Promise<NotificationResponseDto[]> {
    const notifications = await this.notificationRepository.findMany(userId);
    return notifications.map(n => ({
      id: n.id,
      userId: n.userId,
      title: n.title,
      content: n.content,
      type: n.type,
      isRead: n.isRead,
      metadata: n.metadata,
      createdAt: n.createdAt,
    }));
  }

  async markAsRead(id: string): Promise<void> {
    await this.notificationRepository.markAsRead(id);
  }

  async markAllAsRead(userId?: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}
