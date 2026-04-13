import React from "react";
import PointsSettingClient from "./PointsSettingClient";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cấu Hình Điểm Thưởng - Admin Shop Cosmetics',
  description: 'Quản lý cài đặt cấu hình điểm thưởng.',
};

export default function PointsSettingPage() {
  return (
    <div className="w-full flex-col p-4 md:p-8 space-y-4">
      <div className="flex justify-between items-center bg-bg-card backdrop-blur-xl p-4 md:p-8 rounded-2xl border border-border-default shadow-sm w-full">
        <div className="flex flex-col gap-1 items-start justify-center">
          <h1 className="font-bold text-2xl lg:text-3xl m-0 tracking-tight text-text-main">
            Cấu Hình
          </h1>
          <p className="text-sm font-medium text-text-muted m-0">
            Quản lý cấu hình cài đặt điểm thưởng và hệ thống
          </p>
        </div>
      </div>
      <PointsSettingClient />
    </div>
  );
}
