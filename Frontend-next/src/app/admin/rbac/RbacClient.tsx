"use client";

import { useState } from "react";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import RolesTabContent from "./components/RolesTabContent";
import PermissionsTabContent from "./components/PermissionsTabContent";
export default function RbacClient() {
  
  useSWTTitle("Quản lý Quyền Hạn (RBAC)");
  const [activeTab, setActiveTab] = useState("roles");
  const [refreshRoles, setRefreshRoles] = useState(0);
  const [refreshPermissions, setRefreshPermissions] = useState(0);

  const tabItems = [
    {
      key: "roles",
      label: "Quản lý Roles",
      children: (
        <div className="mt-4">
          <RolesTabContent
            onRefresh={() => setRefreshRoles((prev) => prev + 1)}
            refreshKey={refreshRoles}
          />
        </div>
      ),
    },
    {
      key: "permissions",
      label: "Quản lý Permissions",
      children: (
        <div className="mt-4">
          <PermissionsTabContent
            onRefresh={() => setRefreshPermissions((prev) => prev + 1)}
            refreshKey={refreshPermissions}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <SWTTabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        className="[&_.ant-tabs-nav]:mb-0! [&_.ant-tabs-nav]:after:hidden! [&_.ant-tabs-tab]:px-6! [&_.ant-tabs-tab]:py-3! [&_.ant-tabs-tab-active]:bg-brand-500/10! [&_.ant-tabs-tab]:rounded-t-2xl! transition-all"
      />
    </div>
  );
}
