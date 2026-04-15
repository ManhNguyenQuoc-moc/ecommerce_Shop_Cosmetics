"use client";

import { useTransition } from "react";
import POFilters from "./components/POFilters";
import POTable from "./components/POTable";
import useSWTTilte from "@/src/@core/hooks/useSWTTitle";
export default function PurchasesClient() {
  useSWTTilte("Quản lý Nhập hàng");
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <POFilters startTransition={startTransition} />
      <POTable isPending={isPending} />
    </>
  );
}
