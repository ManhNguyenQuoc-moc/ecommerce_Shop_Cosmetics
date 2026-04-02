export interface InventoryQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  categoryId?: string;
  variantId?: string;
  status?: 'EXPIRED' | 'NEAR_EXPIRY' | 'GOOD' | 'OUT_OF_STOCK' | 'all';
  sortBy?: 'expiry_asc' | 'expiry_desc' | 'qty_asc' | 'qty_desc' | 'newest';
}
