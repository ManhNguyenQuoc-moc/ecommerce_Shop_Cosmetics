"use client";

import React, { useState } from 'react';
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import CategoryTable from "./components/CategoryTable";
import CategoryGroupTable from "./components/CategoryGroupTable";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import AddCategoryModal from "./components/AddCategoryModal";
import AddCategoryGroupModal from "./components/AddCategoryGroupModal";
import { CategoryResponseDto } from "@/src/services/models/category/output.dto";

export default function CategoriesClient() {
  useSWTTitle("Quản lý Danh mục & Nhóm | Admin");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") === "groups" ? "groups" : "categories";

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryResponseDto | null>(null);

  // Group Modal State
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);

  const onTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: CategoryResponseDto) => {
    setEditingCategory(category);
    setIsCategoryModalOpen(true);
  };

  const handleOpenAddGroup = () => {
    setEditingGroup(null);
    setIsGroupModalOpen(true);
  };

  const handleOpenEditGroup = (group: any) => {
    setEditingGroup(group);
    setIsGroupModalOpen(true);
  };

  const tabItems = [
    {
      key: "categories",
      label: "Danh mục sản phẩm",
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <CategoryTable onEdit={handleOpenEditCategory} onAdd={handleOpenAddCategory} />
        </div>
      )
    },
    {
      key: "groups",
      label: "Nhóm danh mục",
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <CategoryGroupTable onEdit={handleOpenEditGroup} onAdd={handleOpenAddGroup} />
        </div>
      )
    }
  ];

  return (
    <>
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
        initialData={editingCategory}
      />

      <AddCategoryGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => setIsGroupModalOpen(false)}
        initialData={editingGroup}
      />
    </>
  );
}
