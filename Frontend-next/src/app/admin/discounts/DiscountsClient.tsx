"use client";

import { useState, useTransition } from 'react';
import VoucherTable from "./components/VoucherTable";
import VoucherFilters from "./components/VoucherFilters";
import AddVoucherModal from "./components/AddVoucherModal";
import { VoucherResponseDto } from "@/src/services/models/voucher/output.dto";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import { get } from "@/src/@core/utils/api";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { useSearchParams } from "next/navigation";
import { showNotificationError } from "@/src/@core/utils/message";
import { exportVouchersToExcel, exportVouchersToPDF } from "@/src/@core/utils/excelandpdf/exportVoucher";
import { VOUCHER_API_ENDPOINT } from "@/src/services/admin/user/voucher.hook";
import { PaginationResponse } from "@/src/@core/http/models/PaginationResponse";

export default function DiscountsClient() {
  useSWTTitle("Quản lý Voucher | Admin");
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingVoucher, setEditingVoucher] = useState<VoucherResponseDto | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();

  const handleOpenAdd = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (voucher: VoucherResponseDto) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  const fetchAllVouchers = async () => {
    const filters = {
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || "all",
      type: searchParams.get("type") || "all",
      redeemType: searchParams.get("redeemType") || "all",
      sortBy: searchParams.get("sortBy") || "newest",
      includeExpired: "true",
    };

    const query = buildQueryString({ ...filters, page: 1, pageSize: 9999 });
    const response = await get<PaginationResponse<VoucherResponseDto>>(`${VOUCHER_API_ENDPOINT}${query}`);
    return response.data;
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllVouchers();
      await exportVouchersToExcel(data);
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
      const data = await fetchAllVouchers();
      await exportVouchersToPDF(data);
    } catch (error) {
      console.error("Export error:", error);
      showNotificationError("Có lỗi xảy ra khi xuất file PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="admin-card p-6">
      <VoucherFilters 
        onAdd={handleOpenAdd} 
        startTransition={startTransition}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
      />
      <VoucherTable onEdit={handleOpenEdit} />
      <AddVoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingVoucher}
      />
    </div>
  );
}
