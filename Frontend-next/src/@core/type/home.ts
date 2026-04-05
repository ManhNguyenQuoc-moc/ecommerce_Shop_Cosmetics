import { ProductListItemDto } from "@/src/services/models/product/output.dto";

export type HomeData = {
  banners: any[];
  categories: any[];
  trendingProducts: ProductListItemDto[];
  bestSellingProducts: ProductListItemDto[];
  newestProducts: ProductListItemDto[];
  flashSaleProducts: ProductListItemDto[];
  brands: any[];
};