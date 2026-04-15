"use client";

import Image from "next/image";
import Link from "next/link";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { ProductSmallItemDto } from "@/src/services/models/product/output.dto";

type Props = {
  product?: ProductSmallItemDto;
  loading?: boolean;
};

export default function ProductSmallCard({
  product,
  loading = false
}: Props) {
  // Calculate discount percentage
  const isSale = !!product?.salePrice && product.salePrice > 0 && product?.price > product.salePrice;
  const discountPercent = isSale && product?.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const content = (
    <div className="flex items-center gap-3 p-3 ">
      {/* image */}
      {product?.image && (
        <div className="w-[60px] h-[60px] relative flex-shrink-0">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover rounded"
          />
        </div>
      )}

      {/* info */}
      <div className="flex flex-col justify-center flex-1 min-w-0">
        {/* name */}
        <div className="text-xs text-gray-700 line-clamp-2 leading-tight">
          {product?.name}
        </div>

        {/* price */}
        <div className="mt-1 flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            <span className="text-orange-500 font-semibold text-sm whitespace-nowrap">
              {product?.salePrice
                ? product.salePrice.toLocaleString()
                : product?.price.toLocaleString()}đ
            </span>

            {isSale && (
              <span className="line-through text-gray-400 text-xs whitespace-nowrap">
                {product.price.toLocaleString()}đ
              </span>
            )}
          </div>

          {discountPercent > 0 && (
            <span className="text-[9px] font-bold text-white bg-orange-500 px-1.5 py-0.5 rounded-sm flex-shrink-0">
              -{discountPercent}%
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (!product) {
    return (
      <SWTCard
        loading={loading}
        className="hover:bg-gray-50 border hover:border-brand-500 transition cursor-pointer"
      >
        {content}
      </SWTCard>
    );
  }

  return (
    <Link href={`/products/${product.id}`}>
      <SWTCard
        loading={loading}
        className="hover:bg-gray-50 border hover:border-brand-500 transition cursor-pointer"
      >
        {content}
      </SWTCard>
    </Link>
  );
}
