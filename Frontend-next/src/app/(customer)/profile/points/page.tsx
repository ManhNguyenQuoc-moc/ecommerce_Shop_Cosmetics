"use client";

import PointsSummary from "./components/PointsSummary";
import PointsHistoryTable from "./components/PointsHistoryTable";
import { usePoints } from "@/src/hooks/customer/points.hook";
import SWTTabs from "@/src/@core/component/AntD/SWTTabs";
import RedeemVoucherCatalog from "./components/RedeemVoucherCatalog";
import { useState } from "react";

export default function PointsPage() {
  const { summary, history, isLoading } = usePoints();

  const [activeTab, setActiveTab] = useState("REDEEM");

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <div className="flex flex-row items-center gap-5 px-4 mb-2">
        <div className="flex flex-col">
            <h1 className="text-3xl font-black text-text-main uppercase tracking-tight m-0">Quản lý điểm thưởng</h1>
            <p className="text-[11px] text-text-muted font-black uppercase tracking-widest opacity-60 mt-1">Tích luỹ và sử dụng điểm để nhận nhiều ưu đãi</p>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {isLoading ? (
            <div className="flex flex-col gap-8 px-4">
                <div className="h-48 bg-bg-card rounded-[32px] animate-pulse border border-border-default/30"></div>
                <div className="h-96 bg-bg-card rounded-[32px] animate-pulse border border-border-default/30"></div>
            </div>
        ) : (
            <>
                <PointsSummary summary={summary} />
                
                <div className="mt-4">
                  <SWTTabs
                    activeKey={activeTab}
                    onChange={(k) => setActiveTab(k)}
                    className="px-4"
                    items={[
                      { key: "REDEEM", label: "Đổi Mã Ưu Đãi" },
                      { key: "HISTORY", label: "Lịch sử tích điểm" },
                    ]}
                  />
                  <div className="mt-6 px-1">
                    {activeTab === "REDEEM" && <RedeemVoucherCatalog />}
                    {activeTab === "HISTORY" && <PointsHistoryTable history={history} />}
                  </div>
                </div>
            </>
        )}
      </div>
    </div>
  );
}