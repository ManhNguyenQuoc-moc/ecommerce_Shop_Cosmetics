export type NotificationType =
  | "NEW_ORDER"
  | "LOW_STOCK"
  | "EXPIRING_PRODUCT"
  | "NEW_REVIEW"
  | "NEW_QUESTION"
  | "SYSTEM";
  
export interface CreateNotificationDto {
  userId?: string;
  title: string;
  content: string;
  type: NotificationType;
  metadata?: any;
}