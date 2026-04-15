import ProductSmallCard from "./ProductSmallCard";
import { ProductSmallItemDto } from "@/src/services/models/product/output.dto";

type Props = {
  products: ProductSmallItemDto[];
};

export default function BrandProducts({ products }: Props) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl space-y-4 bg-white mt-2.5 p-2">
      <h3 className="font-semibold">
        Sản phẩm cùng thương hiệu
      </h3>
      <div className="flex flex-col gap-2">
        {products.map((product) => (
          <ProductSmallCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
