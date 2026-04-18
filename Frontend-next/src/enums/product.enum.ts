export enum ProductStatus {
  ACTIVE = "ACTIVE",
  HIDDEN = "HIDDEN",
}

export enum ProductStatusTag {
  BEST_SELLING = "BEST_SELLING",
  TRENDING = "TRENDING",
  NEW = "NEW",
  SALE = "SALE",
}

export type ProductStatusType = `${ProductStatus}`;
export type ProductStatusTagType = `${ProductStatusTag}`;
