"use client";

import AdminProfileForm from "./components/AdminProfileForm";
import { useUserProfile } from "@/src/hooks/admin/user.hook";
import { Spin } from "antd";

export default function AdminProfilePage() {
  const { data: profile, isLoading } = useUserProfile();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Spin size="large" tip="Đang tải hồ sơ..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <AdminProfileForm initialData={profile} />
    </div>
  );
}

