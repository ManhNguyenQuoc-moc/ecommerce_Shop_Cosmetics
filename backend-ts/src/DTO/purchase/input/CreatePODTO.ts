export interface CreatePOItemDTO {
  variantId: string;
  orderedQty: number;
  costPrice: number;
}

export interface CreatePODTO {
  username: string;
  brandId: string;
  note?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
  items: CreatePOItemDTO[];
}

export interface POQueryFiltersDTO {
  search?: string;     // search by code OR brand name
  status?: string;
  brandId?: string;
  sortBy?: 'newest' | 'oldest' | 'total_asc' | 'total_desc';
}
