import { getProfile } from "@/src/services/customer/user.service";
import AdminProfileForm from "./components/AdminProfileForm";

export const metadata = {
  title: "Hồ Sơ Quản Trị Viên | Admin",
};

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {profile && (
        <AdminProfileForm initialData={profile} />
      )}
    </div>
  );
}
