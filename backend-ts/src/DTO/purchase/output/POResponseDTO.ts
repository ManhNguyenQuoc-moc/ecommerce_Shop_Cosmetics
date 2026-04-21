export type POStatus = 'DRAFT' | 'CONFIRMED' | 'PARTIALLY_RECEIVED' | 'COMPLETED' | 'CANCELLED';
export type POPriority = 'LOW' | 'NORMAL' | 'HIGH';

export interface VariantInPODTO {
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
  email?: string | null;
  phone?: string | null;
}

export interface POListItemDTO {
  id: string;
  code: string;
  brandId: string;
  brand: BrandInPODTO;
  status: POStatus;
  priority: POPriority;
  totalAmount: number;
  note?: string | null;
  creator?: {
    full_name: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface POReceiptItemDTO {
  variantId: string;
  quantity: number;
  batchNumber: string;
  expiryDate: string;
  createdAt: string;
}

export interface PODetailDTO extends POListItemDTO {
  rejectionNote?: string | null;
  items: POItemResponseDTO[];
  receipts?: POReceiptItemDTO[];
}

export interface POListResponseDTO {
  orders: POListItemDTO[];
  total: number;
  page: number;
  limit: number;
}
