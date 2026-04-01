export interface POItemInput {
  variantId: string;
  orderedQty: number;
  costPrice: number;
}

export interface CreatePOInput {
  brandId: string;
  note?: string;
  items: POItemInput[];
}

export interface UpdatePOInput {
  brandId: string;
  note?: string;
  items: POItemInput[];
}

export interface ReceiveStockItemInput {
  variantId: string;
  quantity: number;
  batchNumber: string;
  expiryDate: Date;
  manufacturingDate?: Date;
  costPrice: number;
  note?: string;
}

export interface ReceiveStockInput {
  poId: string;
  items: ReceiveStockItemInput[];
}

export interface POQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  brandId?: string;
  sortBy?: 'newest' | 'oldest' | 'total_asc' | 'total_desc';
}
