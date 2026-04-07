"use client";

import SWTSkeleton from "@/src/@core/component/SWTSkeleton";

export function ProfileSidebarSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="bg-gradient-to-r from-brand-50/50 to-rose-50/50 p-6 flex flex-col items-center text-center">
        <div className="mb-3">
          <SWTSkeleton width={80} height={80} rounded="full" className="border-4 border-white shadow-sm" />
        </div>
        <SWTSkeleton width={120} height={20} className="mb-2" />
        <SWTSkeleton width={80} height={12} />
      </div>

      <div className="p-3 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-4 py-3">
            <SWTSkeleton width={20} height={20} rounded="md" />
            <SWTSkeleton width={140} height={16} />
          </div>
        ))}
        <div className="mt-4 pt-4 border-t border-gray-100">
           <div className="flex items-center gap-3 px-4 py-3">
            <SWTSkeleton width={20} height={20} rounded="md" />
            <SWTSkeleton width={100} height={16} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-8 min-h-[600px] space-y-8">
      <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
        <SWTSkeleton width={100} height={100} rounded="full" />
        <div className="space-y-3">
          <SWTSkeleton width={200} height={28} />
          <SWTSkeleton width={150} height={16} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <SWTSkeleton width={100} height={16} />
            <SWTSkeleton className="w-full" height={42} rounded="xl" />
          </div>
        ))}
      </div>

      <div className="pt-6 flex justify-end">
        <SWTSkeleton width={140} height={42} rounded="xl" />
      </div>
    </div>
  );
}

export function ProfileSubPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <SWTSkeleton width={250} height={32} />
        <SWTSkeleton width={350} height={20} />
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <div className="flex gap-4 border-b border-gray-100 pb-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SWTSkeleton key={i} width={80} height={24} rounded="md" />
          ))}
        </div>
        <ProfileListSkeleton />
      </div>
    </div>
  );
}

export function ProfileListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="p-4 border border-gray-100 rounded-xl space-y-4">
          <div className="flex justify-between">
            <SWTSkeleton width={120} height={20} />
            <SWTSkeleton width={80} height={20} rounded="full" />
          </div>
          <div className="flex gap-4">
            <SWTSkeleton width={80} height={80} rounded="lg" />
            <div className="flex-1 space-y-2">
              <SWTSkeleton width="60%" height={16} />
              <SWTSkeleton width="30%" height={16} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
