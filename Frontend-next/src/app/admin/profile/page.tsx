"use client";

import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getProfile } from "@/src/services/customer/user.service";
import AdminProfileForm from "./components/AdminProfileForm";
import ProfileSkeleton from "@/src/app/(customer)/profile/components/ProfileSkeleton";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

export default function AdminProfilePage() {
  useSWTTitle("Hồ Sơ Quản Trị Viên | Admin");

  const { data: profile, isLoading } = useFetchSWR(
    "/users/me",
    () => getProfile()
  );

  if (isLoading && !profile) {
    return (
      <div className="animate-fade-in">
         <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {profile && (
        <AdminProfileForm initialData={profile} />
      )}
    </div>
  );
}
