import SWTSkeleton from "@/src/@core/component/SWTSkeleton";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

export default function BrandProductsSkeleton() {
  return (
    <div className="rounded-xl space-y-4 bg-white mt-2.5 p-2">
      <SWTSkeleton width="60%" height={16} />
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <SWTCard key={i} className="hover:bg-gray-50 transition cursor-pointer">
            <div className="flex items-center gap-3 p-3">
              <SWTSkeleton width={60} height={60} rounded="lg" />
              <div className="flex-1 space-y-2">
                <SWTSkeleton width="100%" height={14} />
                <SWTSkeleton width="80%" height={12} />
                <div className="flex gap-2">
                  <SWTSkeleton width="50%" height={14} />
                  <SWTSkeleton width="35%" height={14} />
                </div>
              </div>
            </div>
          </SWTCard>
        ))}
      </div>
    </div>
  );
}
