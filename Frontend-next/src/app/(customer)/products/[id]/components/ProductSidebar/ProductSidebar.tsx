import BrandCard from "./BrandCard";
import RelatedProducts from "./RelatedProducts";
import BrandProducts from "./BrandProducts";
import ShippingInfo from "../ShippingInfo";
type Props = {
  brand: { id: string; name: string } | string;
};
export default function ProductSidebar({ brand }: Props) {
  return (
    <div className="space-y-6">
      <ShippingInfo />
      <BrandCard brand={brand} />
      <RelatedProducts />
      <BrandProducts brand={brand} />
    </div>
  );
}