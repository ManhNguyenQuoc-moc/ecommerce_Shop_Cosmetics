"use client";

import { useTransition } from "react";
import POFilters from "./components/POFilters";
import POTable from "./components/POTable";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
export default function PurchasesClient() {
  useSWTTitle("Quản lý Nhập Hàng | Admin");
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <POFilters startTransition={startTransition} />
      <POTable isPending={isPending} />
    </>
  );
}
