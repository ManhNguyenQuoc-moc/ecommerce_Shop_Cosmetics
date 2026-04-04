export interface VariantBatchDto {
  id: string;
  batchNumber: string;
  expiryDate: Date;
  manufacturingDate?: Date | null;
  quantity: number;
  costPrice: number;
  totalIn: number;
  totalOut: number;
  createdAt: Date;
}

export interface VariantDetailDto {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
  };
  color?: string | null;
  size?: string | null;
  sku?: string | null;
  price: number;
  salePrice?: number | null;
  costPrice?: number;
  stock: number;
  image?: string | null;
  imageId?: string | null;
  statusName: string; // e.g. "NEW", "BEST_SELLING"
  status: string;     // e.g. "Đang bán", "Đã ẩn"
  statusRaw: string;  // e.g. "ACTIVE", "HIDDEN"
  
  batches: VariantBatchDto[];
  
  createdAt: Date;
  updatedAt: Date;
}
