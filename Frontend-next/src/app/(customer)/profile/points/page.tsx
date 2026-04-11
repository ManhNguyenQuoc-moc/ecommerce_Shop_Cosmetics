"use client";

import PointsSummary from "./components/PointsSummary";
import PointsHistoryTable from "./components/PointsHistoryTable";
import { usePoints } from "@/src/hooks/usePoints";
import { SWTLoading } from "@/src/@core/component/SWTLoading";

export default function PointsPage() {
  const { summary, history, isLoading } = usePoints();

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-[400px]">
            <SWTLoading />
        </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý điểm thưởng</h1>
        <p className="text-sm text-gray-500 mt-1">Tích luỹ và sử dụng điểm để nhận nhiều ưu đãi</p>
      </div>

      <div>
        <PointsSummary summary={summary} />
        <PointsHistoryTable history={history} />
      </div>
    </div>
  );
}