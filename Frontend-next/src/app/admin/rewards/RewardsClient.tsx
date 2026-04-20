"use client";

import RewardsTable from "./components/RewardsTable";
import RewardFilters from "./components/RewardFilters";
import useSWTTilte from "@/src/@core/hooks/useSWTTitle";
import { useTransition } from 'react';

export default function RewardsClient() {
  useSWTTilte("Điểm Thưởng | Admin");

  const [, startTransition] = useTransition();

  return (
    <div className="admin-card p-6">
      <RewardFilters startTransition={startTransition} />
      <RewardsTable />
    </div>
  );
}
