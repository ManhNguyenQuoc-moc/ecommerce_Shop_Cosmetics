import {
  UserStatus,
  ProductStatus,
  ProductStatusTag,
  VariantStatus,
  OrderStatus,
  PaymentStatus,
  POStatus,
  POPriority,
  QuestionStatus,
  ReviewStatus,
  WalletStatus,
} from "@/src/enums";

/**
 * Status configuration by entity type
 * Separated to avoid key conflicts from duplicate enum values
 */

export const USER_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [UserStatus.ACTIVE]: { label: "Đang hoạt động", variant: "ACTIVE" },
  [UserStatus.BANNED]: { label: "Bị khóa", variant: "BANNED" },
};

export const PRODUCT_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [ProductStatus.ACTIVE]: { label: "Đang kinh doanh", variant: "ACTIVE" },
  [ProductStatus.HIDDEN]: { label: "Đang ẩn", variant: "HIDDEN" },
};

export const PRODUCT_STATUS_TAG_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [ProductStatusTag.BEST_SELLING]: { label: "Bán chạy", variant: "BEST_SELLING" },
  [ProductStatusTag.TRENDING]: { label: "Xu hướng", variant: "TRENDING" },
  [ProductStatusTag.NEW]: { label: "Mới ra mắt", variant: "NEW" },
  [ProductStatusTag.SALE]: { label: "Khuyến mại", variant: "NEW" },
};

export const VARIANT_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [VariantStatus.ACTIVE]: { label: "Đang kinh doanh", variant: "ACTIVE" },
  [VariantStatus.HIDDEN]: { label: "Đang ẩn", variant: "HIDDEN" },
  [VariantStatus.STOPPED]: { label: "Hết hàng", variant: "STOPPED" },
};

export const ORDER_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [OrderStatus.PENDING]: { label: "Chờ xác nhận", variant: "PENDING" },
  [OrderStatus.CONFIRMED]: { label: "Đã xác nhận", variant: "CONFIRMED" },
  [OrderStatus.SHIPPING]: { label: "Đang giao hàng", variant: "SHIPPING" },
  [OrderStatus.DELIVERED]: { label: "Hoàn tất", variant: "DELIVERED" },
  [OrderStatus.CANCELLED]: { label: "Đã hủy", variant: "CANCELLED" },
  [OrderStatus.RETURNED]: { label: "Trả hàng", variant: "RETURNED" },
};

export const PAYMENT_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [PaymentStatus.PAID]: { label: "Đã thanh toán", variant: "PAID" },
  [PaymentStatus.UNPAID]: { label: "Chưa thanh toán", variant: "UNPAID" },
};

export const PO_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [POStatus.DRAFT]: { label: "Nháp", variant: "DRAFT" },
  [POStatus.CONFIRMED]: { label: "Đã duyệt", variant: "CONFIRMED" },
  [POStatus.PARTIALLY_RECEIVED]: { label: "Nhận một phần", variant: "PARTIALLY_RECEIVED" },
  [POStatus.COMPLETED]: { label: "Hoàn tất", variant: "COMPLETED" },
  [POStatus.CANCELLED]: { label: "Đã hủy", variant: "CANCELLED" },
};

export const PO_PRIORITY_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [POPriority.LOW]: { label: "Thấp", variant: "ACTIVE" },
  [POPriority.NORMAL]: { label: "Thường", variant: "CONFIRMED" },
  [POPriority.HIGH]: { label: "Cao", variant: "BANNED" },
};

export const QUESTION_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [QuestionStatus.ACTIVE]: { label: "Đang hoạt động", variant: "ACTIVE" },
  [QuestionStatus.HIDDEN]: { label: "Đang ẩn", variant: "HIDDEN" },
};

export const REVIEW_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [ReviewStatus.ACTIVE]: { label: "Đã duyệt", variant: "ACTIVE" },
  [ReviewStatus.HIDDEN]: { label: "Bị ẩn", variant: "HIDDEN" },
};

export const WALLET_STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  [WalletStatus.ACTIVE]: { label: "Hoạt động", variant: "ACTIVE" },
  [WalletStatus.LOCKED]: { label: "Đã khóa", variant: "BANNED" },
};

/**
 * Merged config for backward compatibility
 * Prioritizes User/Order statuses (most common)
 */
export const STATUS_CONFIG: Record<
  string,
  { label: string; variant: string }
> = {
  ...USER_STATUS_CONFIG,
  ...ORDER_STATUS_CONFIG,
  ...PAYMENT_STATUS_CONFIG,
  ...PO_STATUS_CONFIG,
  ...PRODUCT_STATUS_TAG_CONFIG,
  // Note: Product/Variant/Question/Review configs not included 
  // to avoid conflicts. Use their specific config constants instead.
};

/**
 * Get status label by status value
 * Falls back to checking merged STATUS_CONFIG if not found
 */
export const getStatusLabel = (status?: string, entityType?: string): string => {
  if (!status) return "N/A";
  
  // Check entity-specific config first if provided
  if (entityType) {
    const configMap: Record<string, Record<string, { label: string; variant: string }>> = {
      user: USER_STATUS_CONFIG,
      product: PRODUCT_STATUS_CONFIG,
      productTag: PRODUCT_STATUS_TAG_CONFIG,
      variant: VARIANT_STATUS_CONFIG,
      order: ORDER_STATUS_CONFIG,
      payment: PAYMENT_STATUS_CONFIG,
      po: PO_STATUS_CONFIG,
      poPriority: PO_PRIORITY_CONFIG,
      question: QUESTION_STATUS_CONFIG,
      review: REVIEW_STATUS_CONFIG,
      wallet: WALLET_STATUS_CONFIG,
    };
    const config = configMap[entityType]?.[status];
    if (config) return config.label;
  }
  
  // Fall back to merged config
  return STATUS_CONFIG[status]?.label || status;
};

/**
 * Get status variant (for styling) by status value
 */
export const getStatusVariant = (status?: string, entityType?: string): string => {
  if (!status) return "ACTIVE";
  
  // Check entity-specific config first if provided
  if (entityType) {
    const configMap: Record<string, Record<string, { label: string; variant: string }>> = {
      user: USER_STATUS_CONFIG,
      product: PRODUCT_STATUS_CONFIG,
      productTag: PRODUCT_STATUS_TAG_CONFIG,
      variant: VARIANT_STATUS_CONFIG,
      order: ORDER_STATUS_CONFIG,
      payment: PAYMENT_STATUS_CONFIG,
      po: PO_STATUS_CONFIG,
      poPriority: PO_PRIORITY_CONFIG,
      question: QUESTION_STATUS_CONFIG,
      review: REVIEW_STATUS_CONFIG,
      wallet: WALLET_STATUS_CONFIG,
    };
    const config = configMap[entityType]?.[status];
    if (config) return config.variant;
  }
  
  // Fall back to merged config
  return STATUS_CONFIG[status]?.variant || "ACTIVE";
};
