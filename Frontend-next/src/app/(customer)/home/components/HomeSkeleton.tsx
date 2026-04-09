"use client";
import SWTSkeleton from "@/src/@core/component/SWTSkeleton";

export default function HomeSkeleton() {
  return (
    <div className="flex flex-col w-full animate-in fade-in duration-500">
      {/* Banner Skeleton */}
      <section className="w-full relative md:pt-6 mb-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-3 hidden lg:block">
              <SWTSkeleton height={300} rounded="3xl" />
            </div>
            <div className="lg:col-span-9">
              <SWTSkeleton height={300} rounded="3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section Skeleton */}
      <section className="w-full mb-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <SWTSkeleton width={40} height={40} rounded="full" />
                <SWTSkeleton width={100} height={16} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Flash Sale Skeleton */}
      <section className="w-full mb-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4 px-4">
            <SWTSkeleton width={150} height={32} />
            <SWTSkeleton width={100} height={24} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Skeleton */}
      <section className="w-full mb-8">
        <div className="container mx-auto">
          <SWTSkeleton width={200} height={28} className="mb-6 ml-4" />
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 px-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <SWTSkeleton width={80} height={80} rounded="full" />
                <SWTSkeleton width={60} height={12} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid Skeleton */}
      <section className="w-full mb-8">
        <div className="container mx-auto">
          <SWTSkeleton width={250} height={28} className="mb-6 ml-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 px-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm flex flex-col gap-3">
      <SWTSkeleton className="aspect-square w-full" rounded="xl" />
      <div className="flex flex-col gap-2">
        <SWTSkeleton width="40%" height={10} />
        <SWTSkeleton width="90%" height={16} />
        <SWTSkeleton width="95%" height={16} />
        <div className="flex justify-between items-center pt-2">
          <SWTSkeleton width="50%" height={20} />
          <SWTSkeleton width={30} height={30} rounded="full" />
        </div>
      </div>
    </div>
  );
}
