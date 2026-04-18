
import { Settings, Award } from "lucide-react";
import AdminPageHeader from "../../components/AdminPageHeader";
import PointsSettingClient from "./PointsSettingClient";
import type { Metadata } from 'next';

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: 'Cấu Hình Điểm Thưởng - Admin Shop Cosmetics',
  description: 'Quản lý cài đặt cấu hình điểm thưởng.',
};

export default function PointsSettingPage() {
  return (
    <div className="w-full flex-col flex gap-6 animate-fade-in">
      <AdminPageHeader
        title="Cấu Hình Điểm Thưởng"
        subtitle="Quản lý cấu hình cài đặt điểm thưởng và hệ thống"
        icon={<Settings size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Settings" },
          { title: "Điểm Thưởng" }
        ]}
      />
      <PointsSettingClient />
    </div>
  );
}
