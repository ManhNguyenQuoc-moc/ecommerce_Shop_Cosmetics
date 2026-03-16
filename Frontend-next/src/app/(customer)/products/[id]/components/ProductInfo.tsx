import { Star } from "lucide-react";

export default function ProductInfo({ product }: Props) {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold leading-snug text-gray-900">
        {product.name}
      </h1>
      <div className="flex items-center gap-2 text-xl mb-1.5">
        <span className="text-gray-500">Thương hiệu:</span>
        <span className="px-2 py-0.5 rounded bg-blue-100 text-gray-700 font-medium">
          {product.brand}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-3 text-md text-gray-600">
        <div className="flex items-center gap-1 bg-orange-500 rounded-xl p-2">
          <span className="font-medium text-white">
            {product.rating ?? "0"}
          </span>
          <Star className="text-white fill-white" size={16}/>
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
        {product.shortdescription}
      </p>

    </div>
  );
}