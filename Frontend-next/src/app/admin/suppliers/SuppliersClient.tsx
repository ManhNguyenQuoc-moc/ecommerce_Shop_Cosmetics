"use client";

import { useState } from 'react';
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import BrandTable from "./components/BrandTable";
import BrandFilters from "./components/BrandFilters";
import AddBrandModal from "./components/AddBrandModal";
import { BrandQueryFilters } from "@/src/services/models/brand/input.dto";
import { BrandResponseDto } from "@/src/services/models/brand/output.dto";
import { exportSuppliersToExcel, exportSuppliersToPDF } from "@/src/@core/utils/exportSupplier";
import { get } from "@/src/@core/utils/api";
import { BRAND_API_ENDPOINT } from "@/src/services/admin/brand/brand.hook";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { PaginationResponse } from "@/src/@core/http/models/PaginationResponse";
import { showNotificationError, showNotificationSuccess } from "@/src/@core/utils/message";

export default function SuppliersClient() {
  useSWTTitle("Quản lý Nhà cung cấp | Admin");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<BrandResponseDto | null>(null);
  const [params, setParams] = useState<BrandQueryFilters>({
    page: 1,
    pageSize: 6,
    sortBy: "newest",
    mediaStatus: "all",
    search: "",
  });

  const handleParamChange = (newParams: Partial<BrandQueryFilters>) => {
    setParams((prev) => {
      const nextParams = { ...prev, ...newParams };

      if (newParams.page !== undefined || newParams.pageSize !== undefined) {
        return nextParams;
      }

      return { ...nextParams, page: 1 };
    });
  };

  const handleClear = () => {
    setParams({
      page: 1,
      pageSize: 6,
      sortBy: "newest",
      mediaStatus: "all",
      search: "",
    });
  };

  const handleOpenAddModal = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: BrandResponseDto) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
  };

  const handleExport = async (format: 'excel' | 'pdf') => {
    setIsExporting(true);
    try {
      // Fetch all brands matching filters (omitting page/pageSize to get all)
      const queryString = buildQueryString({
        ...params,
        page: null,
        pageSize: null
      });
      
      const response = await get<PaginationResponse<BrandResponseDto>>(`${BRAND_API_ENDPOINT}${queryString}`);
      const allBrands = response.data || [];

      if (allBrands.length === 0) {
        showNotificationError("Không có dữ liệu để xuất!");
        return;
      }

      if (format === 'excel') {
        await exportSuppliersToExcel(allBrands);
      } else {
        await exportSuppliersToPDF(allBrands);
      }
      
      showNotificationSuccess(`Xuất file ${format.toUpperCase()} thành công!`);
    } catch (error: any) {
      showNotificationError(error.message || "Lỗi khi xuất dữ liệu");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="admin-card p-6">

      <BrandFilters
        params={params}
        onParamChange={handleParamChange}
        onClear={handleClear}
        onAdd={handleOpenAddModal}
        onExportExcel={() => handleExport('excel')}
        onExportPDF={() => handleExport('pdf')}
        isExporting={isExporting}
      />
      <BrandTable
        params={params}
        onEdit={handleOpenEditModal}
        onParamChange={handleParamChange}
      />
      
      <AddBrandModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        initialData={selectedBrand} 
      />
    </div>
  );
}
