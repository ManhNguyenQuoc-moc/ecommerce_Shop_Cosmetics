
import RbacClient from "./RbacClient";
import AdminPageHeader from "../components/AdminPageHeader";
import { ShieldAlert } from "lucide-react";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

export default function RbacPage() {
  return (
      <div className="space-y-6 animate-fade-in text-text-main">
       <AdminPageHeader
        title="Quản lý Quyền Hạn"
        subtitle="Quản lý vai trò và quyền hạn của người dùng trong hệ thống."
        icon={<ShieldAlert size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý Quyền Hạn" },
        ]}
        tooltip={{
          title: "Quản lý vai trò và quyền hạn của người dùng.",
          placement: "left"
        }}
      />
       <Suspense fallback={<div>Đang tải...</div>}>
        <RbacClient />
      </Suspense>
      </div>
  );
}
