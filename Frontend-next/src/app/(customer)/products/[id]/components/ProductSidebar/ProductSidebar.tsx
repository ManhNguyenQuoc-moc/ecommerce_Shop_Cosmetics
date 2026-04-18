import ShippingInfo from "../ShippingInfo";
import BrandCard from "./BrandCard";
import RelatedProducts from "./RelatedProducts";
import BrandProducts from "./BrandProducts";
import { ProductSmallItemDto } from "@/src/services/models/product/output.dto";
import { BrandResponseDto } from "@/src/services/models/brand/output.dto";

type Props = {
  brand: BrandResponseDto;
  productId?: string;
  relatedProducts: ProductSmallItemDto[];
  brandProducts: ProductSmallItemDto[];
};

export default function ProductSidebar({ brand, relatedProducts, brandProducts }: Props) {
  return (
    <div className="space-y-6">
      <ShippingInfo />
      <BrandCard brand={brand} />
      <RelatedProducts products={relatedProducts} />
      <BrandProducts products={brandProducts} />
    </div>
  );
}