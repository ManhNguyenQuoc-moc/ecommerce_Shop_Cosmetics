import { CategoryResponseDto} from "@/src/services/models/category/output.dto";
import { ProductListItemDto } from "@/src/services/models/product/output.dto";
import { BrandResponseDto } from "@/src/services/models/brand/output.dto";

export type HomeData = {
  banners: any[];
  categories: CategoryResponseDto[];
  trendingProducts: ProductListItemDto[];
  bestSellingProducts: ProductListItemDto[];
  newestProducts: ProductListItemDto[];
  flashSaleProducts: ProductListItemDto[];
  brands: BrandResponseDto[];
};