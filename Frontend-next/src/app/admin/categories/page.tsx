"use client";

import React, { useState } from 'react';
import { Info, Layers, Plus, List } from "lucide-react";
import SWTTooltip from "@/src/@core/component/AntD/SWTTooltip";
import SWTBreadcrumb from "@/src/@core/component/AntD/SWTBreadcrumb";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import CategoryTable from "./components/CategoryTable";
import CategoryFilters from "./components/CategoryFilters";
import CategoryGroupTable from "./components/CategoryGroupTable";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import AddCategoryModal from "./components/AddCategoryModal";
import AddCategoryGroupModal from "./components/AddCategoryGroupModal";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function CategoriesPage() {
  useSWTTitle("Quản Lý Danh Mục & Nhóm | Admin");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") === "groups" ? "groups" : "categories";

  const onTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const tabItems = [
    {
      key: "categories",
      label: "Danh mục sản phẩm",
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <div className="pt-4">
            {/* <CategoryFilters /> */}
            <CategoryTable />
          </div>
        </div>
      )
    },
    {
      key: "groups",
      label: "Nhóm danh mục",
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <div className="pt-4">
            <CategoryGroupTable />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <SWTBreadcrumb items={[
            { title: "Trang chủ", href: "/admin" },
            { title: "Danh mục & Nhóm" }
          ]} />
          <div className="flex items-center gap-3.5 mt-4 mb-2">
            <Layers size={32} className="text-brand-500" />
            <h2 className="!mb-0 text-3xl font-black tracking-tight whitespace-nowrap text-brand-600 dark:text-admin-accent">
              {activeTab === "categories" ? "Quản lý Danh mục" : "Quản lý Nhóm Danh mục"}
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold uppercase tracking-widest">
            {activeTab === "categories"
              ? "Danh sách các danh mục phân loại sản phẩm."
              : "Phân loại danh mục theo nhóm lớn (vd: Trang điểm, Chăm sóc da)."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <SWTTooltip
            title={<span className="text-sm">Quản lý cơ cấu phân cấp sản phẩm giúp khách hàng dễ dàng tìm kiếm.</span>}
            placement="left"
            color="green"
          >
            <div className="!h-11 !w-11 flex items-center justify-center rounded-xl cursor-help transition-all shadow-sm border group bg-brand-50 hover:bg-brand-500/10 text-brand-600 border-brand-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-admin-accent">
              <Info size={22} className="stroke-[2.5] group-hover:scale-110 transition-transform" />
            </div>
          </SWTTooltip>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="w-full">
        <SWTTabs
          activeKey={activeTab}
          onChange={onTabChange}
          items={tabItems}
          className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav]:after:!hidden [&_.ant-tabs-tab]:!px-6 [&_.ant-tabs-tab]:!py-3 [&_.ant-tabs-tab]:!rounded-t-2xl transition-all [&_.ant-tabs-tab-active]:!bg-brand-500/10"
        />
      </div>

    </div>
  );
}
