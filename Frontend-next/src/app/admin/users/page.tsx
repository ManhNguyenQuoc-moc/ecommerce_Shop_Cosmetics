import React from 'react';
import { Users, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import UsersClient from "./UsersClient";

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Users" }
          ]} />
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Users size={32} className="text-brand-500 shrink-0" />
            <h2 className="!mb-0 text-3xl font-black tracking-tight text-brand-600 dark:text-admin-accent whitespace-nowrap">
              Người dùng hệ thống
            </h2>
          </div>
          <p className="admin-page-subtext">
            Quản trị viên, nhân sự và danh sách khách hàng.
          </p>
        </div>
        <SWTTooltip
          title={<span className="text-sm">Quản lý danh sách người dùng, phân quyền và thông tin khách hàng.</span>}
          placement="left"
          color="pink"
        >
          <div className="!h-11 !w-11 flex items-center justify-center bg-brand-50 hover:bg-brand-500/10 dark:bg-brand-500/10 text-brand-600 dark:text-admin-accent rounded-xl cursor-help transition-all shadow-sm border border-brand-200 dark:border-admin-sidebar-border group">
            <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
          </div>
        </SWTTooltip>
      </div>

      <UsersClient />
    </div>
  );
}
