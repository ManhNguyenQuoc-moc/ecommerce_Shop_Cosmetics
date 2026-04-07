"use client";

import { ProfileSubPageSkeleton } from "../components/ProfileSkeleton";
import { getPointsSummary, getPointsHistory } from "@/src/services/customer/point.service";
import PointsSummary from "./components/PointsSummary";
import PointsHistoryTable from "./components/PointsHistoryTable";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";


export default function PointsPage() {
  const { data: summary, isLoading: isLoadingSummary } = useFetchSWR(
    "points-summary",
    () => getPointsSummary()
  );

  const { data: history, isLoading: isLoadingHistory } = useFetchSWR(
    "points-history",
    () => getPointsHistory()
  );

  const isLoading = isLoadingSummary || isLoadingHistory;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý điểm thưởng</h1>
        <p className="text-sm text-gray-500 mt-1">Tích luỹ và sử dụng điểm để nhận nhiều ưu đãi</p>
      </div>

      {isLoading && !summary ? (
        <ProfileSubPageSkeleton />
      ) : (
        <>
          {summary && <PointsSummary summary={summary} />}
          <PointsHistoryTable history={history || []} loading={isLoadingHistory} />
        </>
      )}
    </div>
  );
}