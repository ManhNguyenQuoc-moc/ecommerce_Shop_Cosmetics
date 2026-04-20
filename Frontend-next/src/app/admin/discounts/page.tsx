import React from 'react';
import { Ticket, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import AdminPageHeader from "../components/AdminPageHeader";
import DiscountsClient from "./DiscountsClient";

export const dynamic = "force-dynamic";

export default function DiscountsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <AdminPageHeader
        title="Quản lý Voucher"
        subtitle="Quản lý các mã giảm giá, voucher và ưu đãi khách hàng."
        icon={<Ticket size={32} />}
        breadcrumbs={[
          { title: "Trang chủ", href: "/admin" },
          { title: "Vouchers" }
        ]}
        tooltip={{
          title: "Quản lý các chương trình khuyến mãi, mã giảm giá và voucher.",
          placement: "left"
        }}
      />
      <DiscountsClient />
    </div>
  );
}
