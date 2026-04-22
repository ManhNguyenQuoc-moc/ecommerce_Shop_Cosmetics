"use client";

import RewardsTable from "./components/RewardsTable";
import RewardFilters from "./components/RewardFilters";
import useSWTTilte from "@/src/@core/hooks/useSWTTitle";
import { useTransition, useState } from 'react';
import { useSearchParams } from "next/navigation";
import { get } from "@/src/@core/utils/api";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { showNotificationError } from "@/src/@core/utils/message";
import { exportRewardsToExcel, exportRewardsToPDF } from "@/src/@core/utils/excelandpdf/exportReward";
import { USER_API_ENDPOINT } from "@/src/services/admin/user/user.hook";
import { PaginationResponse } from "@/src/@core/http/models/PaginationResponse";
import { UserProfileDTO } from "@/src/services/admin/user/models/output.model.dto";

export default function RewardsClient() {
  useSWTTilte("Điểm Thưởng | Admin");

  const [isPending, startTransition] = useTransition();
  const [isExporting, setIsExporting] = useState(false);
  const searchParams = useSearchParams();

  const fetchAllUsersForRewards = async () => {
    const filters = {
      search: searchParams.get("search") || undefined,
      memberRank: searchParams.get("memberRank") === "all" ? undefined : searchParams.get("memberRank"),
      status: searchParams.get("status") === "all" ? undefined : searchParams.get("status"),
      wallet_status: searchParams.get("walletStatus") || "all",
      sortBy: searchParams.get("sortBy") || "points_desc",
    };

    const query = buildQueryString({ ...filters, page: 1, pageSize: 9999 });
    const response = await get<PaginationResponse<UserProfileDTO>>(`${USER_API_ENDPOINT}${query}`);
    return response.data;
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const data = await fetchAllUsersForRewards();
      await exportRewardsToExcel(data);
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
      const data = await fetchAllUsersForRewards();
      await exportRewardsToPDF(data);
    } catch (error) {
      console.error("Export error:", error);
      showNotificationError("Có lỗi xảy ra khi xuất file PDF");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="admin-card p-6">
      <RewardFilters 
        startTransition={startTransition}
        onExportExcel={handleExportExcel}
        onExportPDF={handleExportPDF}
        isExporting={isExporting}
      />
      <RewardsTable />
    </div>
  );
}
