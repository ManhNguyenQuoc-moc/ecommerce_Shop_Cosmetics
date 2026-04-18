
import { ClipboardList } from "lucide-react";
import AdminPageHeader from "../components/AdminPageHeader";
import OrdersClient from "./OrdersClient";

export const dynamic = "force-dynamic";

export default function OrdersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        title="Quản lý Đơn hàng"
        subtitle="Theo dõi, xử lý và cập nhật trạng thái các đơn hàng của hệ thống."
        icon={<ClipboardList size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Quản lý đơn hàng" }
        ]}
        tooltip={{
          title: "Theo dõi đơn hàng, trạng thái thanh toán và vận chuyển từ khách hàng.",
          placement: "left"
        }}
      />

      <OrdersClient />
    </div>
  );
}
