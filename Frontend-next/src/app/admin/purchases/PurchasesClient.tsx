"use client";

import { useTransition, useState } from "react";
import POFilters from "./components/POFilters";
import POTable from "./components/POTable";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import { getPurchaseOrders } from "@/src/services/admin/iventory/purchase.service";
import { useSearchParams } from "next/navigation";
import { showNotificationError } from "@/src/@core/utils/message";
import { exportPurchasesToExcel, exportPurchasesToPDF } from "@/src/@core/utils/excelandpdf/exportPurchase";
import { POQueryParams } from "@/src/services/models/purchase/input.dto";
export default function PurchasesClient() {
  useSWTTitle("Quản lý Nhập Hàng | Admin");
  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();

  const fetchAllPurchases = async () => {
    const filters: POQueryParams = {
      search: searchParams.get("search") || undefined,
      status: (searchParams.get("status") as POQueryParams["status"]) || undefined,
      brandId: searchParams.get("brandId") || undefined,
      sortBy: (searchParams.get("sortBy") || "newest") as POQueryParams["sortBy"],
    };

    const response = await getPurchaseOrders({ ...filters, page: 1, limit: 9999 });
    return response.data;
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllPurchases();
      await exportPurchasesToExcel(data);
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
      const data = await fetchAllPurchases();
      await exportPurchasesToPDF(data);
    } catch (error) {
      console.error("Export error:", error);
      showNotificationError("Có lỗi xảy ra khi xuất file PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="admin-card p-6">
      <POFilters 
        startTransition={startTransition} 
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
      />
      <POTable isPending={isPending} />
    </div>
  );
}
