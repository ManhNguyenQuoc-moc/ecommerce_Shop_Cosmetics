export interface InventoryBatchDto {
  id: string;
  batchNumber: string;
  quantity: number;
  costPrice: number;
  expiryDate: Date;
  manufacturingDate?: Date | null;
  totalIn: number;
  totalOut: number;
  
  variantId: string;
  variant: {
    sku: string;
    color?: string | null;
    size?: string | null;
    image?: string | null;
    product: {
      id: string;
      name: string;
      category?: string;
    };
  };
  
  status: 'EXPIRED' | 'NEAR_EXPIRY' | 'GOOD' | 'OUT_OF_STOCK';
  createdAt: Date;
}
