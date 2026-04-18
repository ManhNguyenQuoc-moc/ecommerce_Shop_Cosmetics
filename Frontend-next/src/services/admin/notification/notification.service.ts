import { CreateNotificationDto } from "./models/input.dto";
import { NotificationResponseDto } from "./models/output.dto";
import { get, post, patch } from "@/src/@core/utils/api";

export const getNotifications = (): Promise<NotificationResponseDto[]> => {
  return get<NotificationResponseDto[]>("/notifications");
};

export const createNotification = (data: CreateNotificationDto): Promise<NotificationResponseDto> => {
  return post<NotificationResponseDto>("/notifications", data);
};

export const markAsRead = (id: string): Promise<void> => {
  return patch(`/notifications/${id}/read`);
};

export const markAllAsRead = (): Promise<void> => {
  return patch("/notifications/read-all");
};


