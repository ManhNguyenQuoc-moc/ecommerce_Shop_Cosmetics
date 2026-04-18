"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import RewardsTable from "./components/RewardsTable";
import RewardFilters from "./components/RewardFilters";
import useSWTTilte from "@/src/@core/hooks/useSWTTitle";
import { useTransition } from 'react';

export default function RewardsClient() {
  useSWTTilte("Quản lý Điểm Thưởng");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="admin-card p-6 flex flex-col gap-6">
      <RewardFilters startTransition={startTransition} />
      <RewardsTable />
    </div>
  );
}
