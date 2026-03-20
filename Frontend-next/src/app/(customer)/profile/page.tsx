"use client";

import { useAuth } from "@/src/context/AuthContext";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import { getCustomerInfo, getProfile } from "@/src/services/customer/user.service";
import ProfileForm from "./components/ProfileForm";
import SWTCard from "@/src/@core/component/AntD/SWTCard";

export default function ProfilePage() {

  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  const { data: profile, isLoading } = useFetchSWR(
    "/users/me",
    () => getProfile()
  );

  return (
      <SWTCard loading={isLoading} className="min-h-[500px] !border-none !shadow-sm !rounded-2xl">
        {profile && (
          <ProfileForm
            initialData={profile}
          />
        )}
      </SWTCard>
  );
}