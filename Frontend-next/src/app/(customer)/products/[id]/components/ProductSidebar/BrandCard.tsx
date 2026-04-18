import Image from "next/image";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTButton from "@/src/@core/component/AntD/SWTButton";
import { BrandResponseDto } from "@/src/services/models/brand/output.dto";

type Props = {
  brand: BrandResponseDto;
  followers?: number;
  loading?: boolean;
};

export default function BrandCard({
  brand,
  followers = 7950,
  loading = false,
}: Props) {
  const brandName = brand.name;
  const brandLogo = brand?.logo?.url;


  return (
    <SWTCard loading={loading} className="overflow-hidden">
      <div className="flex flex-col items-center gap-3 p-5">
        <div className="w-28 h-16 relative">
          <Image
            src={brandLogo || "/images/main/brands/cocoon-logo.jpg"}
            alt={brandName}
            fill
            className="object-contain"
          />
        </div>

        <h3 className="text-lg font-semibold text-gray-800">
          {brandName}
        </h3>
        <p className="text-xs text-gray-500">
          {followers.toLocaleString()} người theo dõi
        </p>
        <SWTButton className="w-full !bg-brand-600 !text-white py-2 rounded-lg text-sm font-medium hover:!bg-brand-500 transition">
          Theo dõi
        </SWTButton>

      </div>

    </SWTCard>
  );
}