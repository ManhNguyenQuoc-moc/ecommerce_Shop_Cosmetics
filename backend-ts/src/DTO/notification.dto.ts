import { z } from "zod";
import { NotificationType } from "@prisma/client";

export const CreateNotificationSchema = z.object({
  userId: z.string().uuid().optional(),
  title: z.string(),
  content: z.string(),
  type: z.nativeEnum(NotificationType),
  metadata: z.any().optional(),
});

export type CreateNotificationDto = z.infer<typeof CreateNotificationSchema>;

export interface NotificationResponseDto {
  id: string;
  userId: string | null;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  metadata: any;
  createdAt: Date;  
}
