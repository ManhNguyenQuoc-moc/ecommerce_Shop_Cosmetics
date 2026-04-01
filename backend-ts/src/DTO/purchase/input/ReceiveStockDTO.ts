export interface ReceiveStockItemDTO {
  variantId: string;
  quantity: number;
  batchNumber: string;
  expiryDate: Date;
  manufacturingDate?: Date;
  costPrice: number;
  note?: string;
}

export interface ReceiveStockDTO {
  poId: string;
  items: ReceiveStockItemDTO[];
}
