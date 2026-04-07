"use client";

import React from "react";
import SWTSkeleton from "@/src/@core/component/SWTSkeleton";

export default function ProductDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <SWTSkeleton width={80} height={16} />
        <span className="text-gray-300">/</span>
        <SWTSkeleton width={120} height={16} />
        <span className="text-gray-300">/</span>
        <SWTSkeleton width={150} height={16} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Content Skeleton (Left/Center) */}
        <div className="lg:col-span-9 space-y-8">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 min-h-[600px]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Gallery Skeleton */}
              <div className="lg:col-span-5 space-y-4">
                <SWTSkeleton className="aspect-square w-full" rounded="2xl" />
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((i) => (
                    <SWTSkeleton key={i} className="aspect-square w-full" rounded="lg" />
                  ))}
                </div>
              </div>

              {/* Info Skeleton */}
              <div className="lg:col-span-7 space-y-6 py-2">
                <div className="space-y-2">
                  <SWTSkeleton width={120} height={20} />
                  <SWTSkeleton width="90%" height={32} />
                </div>
                
                <div className="flex items-center gap-4 py-4 border-y border-gray-50">
                  <SWTSkeleton width={150} height={40} />
                  <SWTSkeleton width={100} height={20} />
                </div>

                {/* Variants Skeleton */}
                <div className="space-y-3">
                  <SWTSkeleton width={80} height={18} />
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3].map((i) => (
                      <SWTSkeleton key={i} width={100} height={42} rounded="xl" />
                    ))}
                  </div>
                </div>

                {/* Quantity & Actions Skeleton */}
                <div className="space-y-4 pt-4">
                  <SWTSkeleton width={120} height={45} rounded="xl" />
                  <div className="flex gap-3">
                    <SWTSkeleton width="60%" height={48} rounded="xl" />
                    <SWTSkeleton width="40%" height={48} rounded="xl" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
             <div className="flex border-b">
                {[1, 2, 3].map(i => <SWTSkeleton key={i} width={120} height={48} className="mr-1" />)}
             </div>
             <div className="p-6 space-y-4">
                <SWTSkeleton width="100%" height={20} />
                <SWTSkeleton width="100%" height={20} />
                <SWTSkeleton width="60%" height={20} />
             </div>
          </div>
        </div>

        {/* Sidebar Skeleton (Right) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
            <SWTSkeleton width="100%" height={200} rounded="xl" />
            <SWTSkeleton width="80%" height={24} />
            <SWTSkeleton width="100%" height={60} />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-4">
             <SWTSkeleton width={120} height={20} />
             {[1, 2, 3].map(i => (
               <div key={i} className="flex gap-3">
                 <SWTSkeleton width={60} height={60} rounded="lg" />
                 <div className="flex-1 space-y-2">
                   <SWTSkeleton width="100%" height={14} />
                   <SWTSkeleton width="60%" height={14} />
                 </div>
               </div>
             ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
