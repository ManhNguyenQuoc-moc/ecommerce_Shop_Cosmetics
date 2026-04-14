
import { Users, Info } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import UserTable from "./components/UserTable";
import UserFilters from "./components/UserFilters";

export default function UsersPage() {
  return (
    <div className="space-y-6 animate-fade-in p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Người dùng" }
          ]} />
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Users size={32} className="text-brand-500 shrink-0" />
            <h2 className="text-3xl font-black text-brand-600 dark:text-admin-accent">
              Người dùng hệ thống
            </h2>
          </div>
          <p className="text-slate-500">Quản trị viên và danh sách khách hàng.</p>
        </div>
        <SWTTooltip title="Quản lý danh sách người dùng" placement="left">
          <div className="h-11 w-11 flex items-center justify-center bg-brand-50 rounded-xl border border-brand-200 cursor-help">
            <Info size={22} className="text-brand-600" />
          </div>
        </SWTTooltip>
      </div>

      <div className="bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default p-6">
        <UserFilters />
        <UserTable />
      </div>
    </div>
  );
}