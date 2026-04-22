"use client";

import React, { Suspense, useTransition } from "react";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import InventoryTable from "./components/InventoryTable";
import InventoryFilters from "./components/InventoryFilters";
import InventoryCharts from "./components/InventoryCharts";
import { useState } from "react";
import { get } from "@/src/@core/utils/api";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { showNotificationError } from "@/src/@core/utils/message";
import { exportInventoryToExcel, exportInventoryToPDF } from "@/src/@core/utils/excelandpdf/exportInventory";
import { INVENTORY_API_ENDPOINT } from "@/src/services/admin/iventory/inventory.hook";
import { PaginationResponse } from "@/src/@core/http/models/PaginationResponse";
import { InventoryBatchDto } from "@/src/services/models/inventory/output.dto";

export default function InventoryClient() {
  useSWTTitle("Quản lý Tồn Kho | Admin");
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = searchParams.get("tab") || "list";

  const onTabChange = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const fetchAllBatches = async () => {
    const filters = {
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || "all",
      sku: searchParams.get("sku") || undefined,
      minQty: searchParams.get("minQty") || undefined,
      maxQty: searchParams.get("maxQty") || undefined,
      sortBy: searchParams.get("sortBy") || "newest",
    };

    const query = buildQueryString({ ...filters, page: 1, pageSize: 9999 });
    const response = await get<PaginationResponse<InventoryBatchDto>>(`${INVENTORY_API_ENDPOINT}/batches${query}`);
    return response.data;
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllBatches();
      await exportInventoryToExcel(data);
    } catch (error) {
      console.error("Export error:", error);
      showNotificationError("Có lỗi xảy ra khi xuất file Excel");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllBatches();
      await exportInventoryToPDF(data);
    } catch (error) {
      console.error("Export error:", error);
      showNotificationError("Có lỗi xảy ra khi xuất file PDF");
    } finally {
      setIsExporting(false);
    }
  };


  const tabItems = [
    {
      key: "list",
      label: "Danh sách tồn kho",
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <InventoryFilters 
            startTransition={startTransition}
            onExportExcel={handleExportExcel}
            onExportPDF={handleExportPDF}
            isExporting={isExporting}
          />
          <InventoryTable isPending={isPending} />
        </div>
      )
    },
    {
      key: "analytics",
      label: "Phân tích kho",
      children: (
        <div className="mt-4 p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
          <InventoryCharts />
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
      <Suspense>
        <SWTTabs
          activeKey={activeTab}
          onChange={onTabChange}
          items={tabItems}
          className="[&_.ant-tabs-nav]:!mb-0 [&_.ant-tabs-nav]:after:!hidden [&_.ant-tabs-tab]:!px-6 [&_.ant-tabs-tab]:!py-3 [&_.ant-tabs-tab-active]:!bg-brand-500/10 [&_.ant-tabs-tab]:!rounded-t-2xl transition-all"
        />
      </Suspense>
    </div>
  );
}
