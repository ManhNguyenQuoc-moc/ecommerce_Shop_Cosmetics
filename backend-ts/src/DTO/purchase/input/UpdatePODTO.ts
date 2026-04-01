export interface UpdatePOItemDTO {
  variantId: string;
  orderedQty: number;
  costPrice: number;
}

export interface UpdatePODTO {
  brandId: string;
  note?: string;
  items: UpdatePOItemDTO[];
}
