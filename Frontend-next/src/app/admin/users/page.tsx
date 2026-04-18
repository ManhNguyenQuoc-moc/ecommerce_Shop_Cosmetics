import { Users, Info } from "lucide-react";
import dynamicImport from "next/dynamic";
import { UserProvider } from "./provider";
import AdminPageHeader from "../components/AdminPageHeader";

export const dynamic = "force-dynamic";

const UsersPageContent = dynamicImport(() => import("./UsersPage"));

export default function UserModule() {
  return (
    <UserProvider>
      <div className="space-y-6 animate-fade-in">
        <AdminPageHeader
          title="Người dùng hệ thống"
          subtitle="Quản trị viên và danh sách khách hàng."
          icon={<Users size={32} />}
          breadcrumbs={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Người dùng" }
          ]}
          tooltip={{
            title: "Quản lý danh sách người dùng",
            placement: "left"
          }}
        />

        <UsersPageContent />
      </div>
    </UserProvider>
  );
}