"use client";

import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getProfile } from "@/src/services/customer/user/user.service";
import ProfileForm from "./components/ProfileForm";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";
import SWTPageHeader from "@/src/@core/component/AntD/SWTPageHeader";
import { UserProfileDTO } from "@/src/services/admin/user/models/output.model.dto";

export default function ProfilePage() {
  const { data: profile, isLoading } = useFetchSWR<UserProfileDTO>("/users/me", getProfile);

  if (isLoading) return <SWTLoading fullPage />;

  return (
    <div>
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