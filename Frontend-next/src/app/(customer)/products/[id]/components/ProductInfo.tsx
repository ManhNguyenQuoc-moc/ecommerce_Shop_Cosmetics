import { Star } from "lucide-react";
import { ProductDetailDto } from "@/src/services/models/product/output.dto";

type Props = {
  product: ProductDetailDto;
};

export default function ProductInfo({ product }: Props) {
  const brandName = product.brand?.name || 'N/A';

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold leading-snug text-gray-900">
        {product.name}
      </h1>
      <div className="flex items-center gap-2 text-xl mb-1.5">
        <span className="text-gray-500">Thương hiệu:</span>
        <span className="px-2 py-0.5 rounded bg-blue-100 text-gray-700 font-medium">
          {brandName}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-md text-gray-600">
        <div className="flex items-center gap-1 bg-orange-500 rounded-xl p-2">
          <span className="font-medium text-white">
            {Number(product.rating || 0).toFixed(1)}
          </span>
          <Star className="text-white fill-white" size={16} />
        </div>
        <span className="text-gray-300">|</span>
        <span className=" p-2 rounded-xl ">
          Đã bán{" "}
          <span className="font-medium ">
            {product.sold ?? 0}
          </span>
        </span>
        <span className="text-gray-300">|</span>
        <span className="rounded-xl p-2">
          Mã sản phẩm:{" "}
          <span className="font-medium text-gray-800">
            {product.id}
          </span>
        </span>
      </div>

      <p className="text-md leading-relaxed text-gray-600 mt-1.5">
        {product.short_description}
      </p>

    </div>
  );
}