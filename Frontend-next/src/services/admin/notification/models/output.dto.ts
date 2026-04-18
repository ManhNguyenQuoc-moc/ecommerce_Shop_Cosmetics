export type NotificationType =
  | "NEW_ORDER"
  | "LOW_STOCK"
  | "EXPIRING_PRODUCT"
  | "NEW_REVIEW"
  | "NEW_QUESTION"
  | "SYSTEM";

export interface NotificationResponseDto {
  id: string;
  userId: string | null;

  title: string;
  content: string;

  type: NotificationType;
  isRead: boolean;

  metadata: any;

  createdAt: string;
}