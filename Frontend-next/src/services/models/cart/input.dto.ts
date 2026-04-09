export interface AddToCartInputDto {
  variantId: string;
  quantity: number;
}

export interface SyncCartItemInputDto {
  variantId: string;
  quantity: number;
}

export interface SyncCartInputDto {
  items: SyncCartItemInputDto[];
}
