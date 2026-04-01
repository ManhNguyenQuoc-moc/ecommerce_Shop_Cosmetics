export type POStatus = 'DRAFT' | 'CONFIRMED' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'CANCELLED';

export interface BrandInPODto {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export interface VariantInPODto {
  id: string;
  sku?: string | null;
  color?: string | null;
  size?: string | null;
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
  totalAmount: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PODetailDto extends POListItemDto {
  items: POItemDto[];
}

export interface POListResponseDto {
  orders: POListItemDto[];
  total: number;
  page: number;
  limit: number;
}

/** Helper: get display label for a PO status */
export const PO_STATUS_LABELS: Record<POStatus, string> = {
  DRAFT: 'Nháp',
  CONFIRMED: 'Đã duyệt',
  PARTIALLY_RECEIVED: 'Nhận một phần',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã hủy',
};
