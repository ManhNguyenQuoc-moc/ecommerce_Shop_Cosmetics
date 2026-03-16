import Image from "next/image";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

type Props = {
  name?: string;
  price?: number;
  originalPrice?: number;
  image?: string;
  loading?: boolean;
};

export default function ProductSmallCard({
  name = "Nước Hoa Hồng...",
  price = 195000,
  originalPrice = 435000,
  image = "/images/main/brands/cocoon-logo.jpg",
  loading = false
}: Props) {
  return (
    <SWTCard
      loading={loading}
      className="hover:bg-gray-50 border hover:border-brand-500 transition cursor-pointer"
    >
      <div className="flex items-center gap-3 p-3">

        {/* image */}
        <div className="w-[60px] h-[60px] relative flex-shrink-0">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover rounded"
          />
        </div>

        {/* info */}
        <div className="flex flex-col justify-center flex-1 min-w-0">

          {/* name */}
          <div className="text-xs text-gray-700 line-clamp-2 leading-tight">
            {name}
          </div>

          {/* price */}
          <div className="mt-1 flex items-center gap-2">

            <span className="text-orange-500 font-semibold text-sm">
              {price.toLocaleString()} đ
            </span>

            {originalPrice && (
              <span className="line-through text-gray-400 text-xs">
                {originalPrice.toLocaleString()} đ
              </span>
            )}

          </div>

        </div>

      </div>
    </SWTCard>
  );
}