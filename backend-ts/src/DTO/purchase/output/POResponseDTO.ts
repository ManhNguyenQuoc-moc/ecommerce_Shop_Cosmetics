export type POStatus = 'DRAFT' | 'CONFIRMED' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'CANCELLED';

export interface VariantInPODTO {
  id: string;
  sku?: string | null;
  color?: string | null;
  size?: string | null;
  product?: {
    id: string;
    name: string;
  } | null;
}

export interface POItemResponseDTO {
  id: string;
  purchaseOrderId: string;
  variantId: string;
  orderedQty: number;
  receivedQty: number;
  costPrice: number;
  createdAt: string;
  updatedAt: string;
  variant?: VariantInPODTO | null;
}

export interface BrandInPODTO {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export interface POListItemDTO {
  id: string;
  code: string;
  brandId: string;
  brand: BrandInPODTO;
  status: POStatus;
  totalAmount: number;
  note?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PODetailDTO extends POListItemDTO {
  items: POItemResponseDTO[];
}

export interface POListResponseDTO {
  orders: POListItemDTO[];
  total: number;
  page: number;
  limit: number;
}
