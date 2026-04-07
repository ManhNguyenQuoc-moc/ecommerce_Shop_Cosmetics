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
import SWTIconButton from "@/src/@core/component/SWTIconButton";
import AddCategoryModal from "./components/AddCategoryModal";
import AddCategoryGroupModal from "./components/AddCategoryGroupModal";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function CategoriesPage() {
  useSWTTitle("Quản Lý Danh Mục & Nhóm | Admin");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const activeTab = searchParams.get("tab") === "groups" ? "groups" : "categories";

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  const onTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const ActionHeader = ({ title, icon: Icon, onAdd, btnText }: { title: string, icon: any, onAdd: () => void, btnText: string }) => (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
          <Icon size={22} className="stroke-[2.5]" />
        </div>
        <h3 className="!mb-0 text-xl font-black text-slate-800 dark:text-admin-accent uppercase tracking-tight">
          {title}
        </h3>
      </div>

      <SWTTooltip title={btnText} placement="top" color="#10b981">
        <div 
          className="flex h-11 w-11 items-center justify-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/30 rounded-xl shadow-sm transition-all cursor-pointer group"
          onClick={onAdd}
        >
          <Plus size={24} className="stroke-[2.5] group-hover:scale-110 group-hover:rotate-90 transition-transform duration-300" />
        </div>
      </SWTTooltip>
    </div>
  );

  const tabItems = [
    {
      key: "categories",
      label: "Danh mục sản phẩm",
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <ActionHeader 
            title="Danh sách danh mục" 
            icon={List} 
            onAdd={() => setIsCategoryModalOpen(true)} 
            btnText="Thêm Danh Mục"
          />
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <CategoryFilters />
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
          <ActionHeader 
            title="Danh sách nhóm danh mục" 
            icon={Layers} 
            onAdd={() => setIsGroupModalOpen(true)} 
            btnText="Thêm Nhóm Mới"
          />
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
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

      <AddCategoryModal 
        isOpen={isCategoryModalOpen} 
        onClose={() => setIsCategoryModalOpen(false)} 
      />

      <AddCategoryGroupModal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
      />
    </div>
  );
}
