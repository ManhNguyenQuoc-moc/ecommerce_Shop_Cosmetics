import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTSkeleton from "@/src/@core/component/SWTSkeleton";

export default function BrandCardSkeleton() {
  return (
    <SWTCard className="overflow-hidden">
      <div className="flex flex-col items-center gap-3 p-5">
        <div className="w-28 h-16 relative">
          <SWTSkeleton className="w-full h-full" rounded="lg" />
        </div>

        <SWTSkeleton width="80%" height={20} />
        <SWTSkeleton width="60%" height={14} />
        <SWTSkeleton className="w-full" height={40} rounded="lg" />
      </div>
    </SWTCard>
  );
}
