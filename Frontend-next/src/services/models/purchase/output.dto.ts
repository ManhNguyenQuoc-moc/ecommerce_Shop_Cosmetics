import { POStatus, POPriority, getStatusLabel } from "@/src/enums";

export type POStatusType = `${POStatus}`;
export type POPriorityType = `${POPriority}`;

export interface BrandInPODto {
  id: string;
  name: string;
  logoUrl?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}
export interface VariantInPODto {
  id: string;
  sku?: string | null;
  color?: string | null;
  size?: string | null;
  image?: string | null;
  product?: {
    id: string;
    name: string;
  } | null;
}

export interface POItemDto {
  id: string;
  purchaseOrderId: string;
  variantId: string;
  orderedQty: number;
  receivedQty: number;
  costPrice: number;
  createdAt: string;
  updatedAt: string;
  variant?: VariantInPODto | null;
}

export interface POListItemDto {
  id: string;
  code: string;
  brandId: string;
  brand: BrandInPODto;
  status: POStatus;
  priority: POPriority;
  totalAmount: number;
  note?: string | null;
  creator?: {
    full_name: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface POReceiptItemDto {
  variantId: string;
  quantity: number;
  batchNumber: string;
  expiryDate: string;
  manufacturingDate?: string;
  createdAt: string;
  variant?: VariantInPODto | null;
}

export interface PODetailDto extends POListItemDto {
  rejectionNote?: string | null;
  items: POItemDto[];
  receipts?: POReceiptItemDto[];
}

export interface POListResponseDto {
  orders: POListItemDto[];
  total: number;
  page: number;
  limit: number;
}

/** Helper: get display label for a PO status - use STATUS_CONFIG from enums instead */
export const PO_STATUS_LABELS: Record<POStatusType, string> = {
  DRAFT: getStatusLabel(POStatus.DRAFT),
  CONFIRMED: getStatusLabel(POStatus.CONFIRMED),
  PARTIALLY_RECEIVED: getStatusLabel(POStatus.PARTIALLY_RECEIVED),
  COMPLETED: getStatusLabel(POStatus.COMPLETED),
  CANCELLED: getStatusLabel(POStatus.CANCELLED),
};

export const PO_PRIORITY_LABELS: Record<POPriorityType, string> = {
  LOW: getStatusLabel(POPriority.LOW),
  NORMAL: getStatusLabel(POPriority.NORMAL),
  HIGH: getStatusLabel(POPriority.HIGH),
};
