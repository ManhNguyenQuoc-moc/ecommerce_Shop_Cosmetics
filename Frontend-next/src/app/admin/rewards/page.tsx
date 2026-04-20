import { Award } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import RewardsClient from "./RewardsClient";

export const dynamic = "force-dynamic";

export default function AdminRewardsPage() {
  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      <AdminPageHeader
        title="Quản lý Điểm Thưởng"
        subtitle="Theo dõi ví điểm thưởng, lịch sử quy đổi và xếp hạng thành viên."
        icon={<Award size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Rewards" }
        ]}
        tooltip={{
          title: "Quản lý hệ thống điểm thưởng và ưu đãi dành cho khách hàng thân thiết.",
          placement: "left"
        }}
      />
      <RewardsClient />
    </div>
  );
}
