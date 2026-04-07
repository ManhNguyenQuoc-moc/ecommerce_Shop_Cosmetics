"use client";

import React from "react";
import SWTSkeleton from "@/src/@core/component/SWTSkeleton";

export default function ProductListSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <SWTSkeleton width={80} height={16} />
        <span className="text-gray-300">/</span>
        <SWTSkeleton width={100} height={16} />
      </div>

      {/* Title Skeleton */}
      <SWTSkeleton width={300} height={32} className="mb-6" />

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Skeleton */}
        <aside className="col-span-12 md:col-span-3 border border-gray-100 rounded-xl p-4 bg-white h-fit space-y-6">
          {/* Categories Section */}
          <div className="space-y-4">
            <SWTSkeleton width={100} height={20} />
            <div className="space-y-3 pl-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <SWTSkeleton key={i} width="80%" height={16} />
              ))}
            </div>
          </div>

          {/* Price Filter Section */}
          <div className="border-t pt-6 space-y-4">
            <SWTSkeleton width={80} height={20} />
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <SWTSkeleton width={18} height={18} rounded="full" />
                  <SWTSkeleton width="70%" height={14} />
                </div>
              ))}
            </div>
          </div>

          {/* Brand Filter Section */}
          <div className="border-t pt-6 space-y-4">
            <SWTSkeleton width={100} height={20} />
            <div className="grid grid-cols-1 gap-3 max-h-[250px]">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <SWTSkeleton width={18} height={18} rounded="sm" />
                  <SWTSkeleton width="60%" height={14} />
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton */}
        <main className="col-span-12 md:col-span-9 space-y-6">
          {/* Sorting Bar Skeleton */}
          <div className="flex justify-end mb-4">
            <SWTSkeleton width={180} height={38} rounded="lg" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm space-y-3">
      <SWTSkeleton className="aspect-square w-full" rounded="xl" />
      <div className="space-y-2">
        <SWTSkeleton width="40%" height={10} />
        <SWTSkeleton width="90%" height={16} />
        <div className="flex justify-between items-center pt-2">
          <SWTSkeleton width="50%" height={20} />
          <SWTSkeleton width={28} height={28} rounded="full" />
        </div>
      </div>
    </div>
  );
}
