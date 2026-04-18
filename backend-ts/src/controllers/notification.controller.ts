import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";

export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  getNotifications = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      const notifications = await this.notificationService.getNotifications(userId);
      res.json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  markAsRead = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      await this.notificationService.markAsRead(id as string);
      res.json({ success: true, message: "Marked as read" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  markAllAsRead = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;
      await this.notificationService.markAllAsRead(userId);
      res.json({ success: true, message: "All marked as read" });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  };
}
