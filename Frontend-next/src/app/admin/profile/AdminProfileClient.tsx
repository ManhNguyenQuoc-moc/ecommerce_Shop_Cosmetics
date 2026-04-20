"use client";

import { UserCheck } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminProfileForm from "./components/AdminProfileForm";
import { useUserProfile } from "@/src/services/admin/user/user.hook";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";

export default function AdminProfileClient() {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return <SWTLoading tip="Đang tải hồ sơ..." />;
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <AdminPageHeader
        title="Hồ sơ Quản trị viên"
        subtitle="Quản lý thông tin cá nhân và cài đặt tài khoản."
        icon={<UserCheck size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Hồ sơ" }
        ]}
      />

      <AdminProfileForm initialData={profile} />
    </div>
  );
}
