"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getProfile } from "@/src/services/customer/user.service";
import ProfileForm from "./components/ProfileForm";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import ProfileSkeleton from "./components/ProfileSkeleton";

export default function ProfilePage() {

  const { currentUser } = useAuth();
  const userId = currentUser?.id;
  const { data: profile, isLoading } = useFetchSWR(
    "/users/me",
    () => getProfile()
  );

  if (isLoading && !profile) {
    return <ProfileSkeleton />;
  }

  return (
      <SWTCard className="min-h-[500px] !border-none !shadow-sm !rounded-2xl">
        {profile && (
          <ProfileForm
            initialData={profile}
          />
        )}
      </SWTCard>
  );
}