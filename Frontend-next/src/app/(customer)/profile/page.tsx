"use client";

import { useEffect, useState } from "react";
import { getProfile } from "@/src/services/customer/user.service";
import ProfileForm from "./components/ProfileForm";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import { UserProfileDTO } from "@/src/services/models/user/output.dto";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";
import SWTPageHeader from "@/src/@core/component/AntD/SWTPageHeader";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <SWTLoading fullPage />;

  return (
    <div className="space-y-6">
      <SWTPageHeader 
        title="Thông tin cá nhân" 
        subtitle="Quản lý thông tin hồ sơ và bảo mật tài khoản của bạn"
        breadcrumbs={[
          { title: "Trang chủ", href: "/" },
          { title: "Tài khoản" },
        ]}
      />
      
      <SWTCard className="min-h-[500px] !border-none !shadow-sm !rounded-2xl">
        {profile && (
          <ProfileForm
            initialData={profile}
          />
        )}
      </SWTCard>
    </div>
  );
}