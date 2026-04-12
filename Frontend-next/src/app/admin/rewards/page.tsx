"use client";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import SWTInput from "@/src/@core/component/AntD/SWTInput";
import { Award, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import RewardTable from "./components/RewardTable";
import RewardFilters from "./components/RewardFilters";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

export default function AdminRewardsPage() {
  useSWTTitle("Điểm Thưởng | Admin");
  return (
    <div className="space-y-6 animate-fade-in relative z-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Rewards" }
          ]} />
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Award size={32} className="text-brand-500 shrink-0" />
            <h2 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap">
              Quản lý Điểm Thưởng
            </h2>
          </div>
          <p className="admin-page-subtext">
             Theo dõi ví điểm thưởng, lịch sử quy đổi và xếp hạng thành viên.
          </p>
        </div>
        <SWTTooltip
          title={<span className="text-sm">Quản lý hệ thống điểm thưởng và ưu đãi dành cho khách hàng thân thiết.</span>}
          placement="left"
          color="pink"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-brand-50 hover:bg-brand-500/10 dark:bg-brand-500/10 text-brand-600 dark:text-admin-accent rounded-xl cursor-help transition-all shadow-sm border border-brand-200 dark:border-admin-sidebar-border group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      {/* Main Content */}
      <div className="admin-card p-6">
        <RewardFilters />
        <RewardTable />
        </div>
    </div>
  );
}
