import { ProductDetailVariantDto } from "@/src/services/models/product/output.dto";

type Props = {
  variants: ProductDetailVariantDto[];
  variant: ProductDetailVariantDto | null;
  setVariant: (v: ProductDetailVariantDto) => void;
  priceRange: { min: number; max: number };
};

export default function ProductVariants({
  variants,
  variant,
  setVariant,
  priceRange,
}: Props) {
  const isColorVariant = variants.some((v) => v.color);
  const isSizeVariant = variants.some((v) => v.size);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <span className="text-3xl text-orange-600 font-bold">
          {variant?.salePrice
            ? `${variant.salePrice.toLocaleString()}đ`
            : `${priceRange.min.toLocaleString()}đ - ${priceRange.max.toLocaleString()}đ`}
        </span>
        {variant?.salePrice && variant?.price && variant.price > variant.salePrice && (
          <span className="line-through text-gray-400 text-lg">
            {variant.price.toLocaleString()}đ
          </span>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-sm mt-2">
          {isColorVariant && (
            <>
              <span className ="text-xl font-semibold">Màu sắc:</span>
              <span className="text-xl font-semibold ml-1">{variant?.color || "Chưa chọn"}</span>
            </>
          )}

          {isSizeVariant && (
            <>
              <span className ="text-xl font-semibold">Dung tích:</span>
              <span className="text-xl font-semibold ml-1">{variant?.size || "Chưa chọn"}</span>
            </>
          )}
        </p>

        <div className="flex flex-wrap gap-2">
          {variants.map((v) => {
            const active = variant?.id === v.id;

            return (
              <button
                key={v.id}
                type="button"
                onClick={() => setVariant(v)}
                className={`px-4 py-2 rounded-full border text-sm transition-all
                ${
                  active
                    ? "border-brand-500 text-brand-500 bg-brand-50 shadow-sm"
                    : "border-gray-300 hover:border-brand-500 text-gray-700"
                }`}
              >
                {v.color || v.size}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}