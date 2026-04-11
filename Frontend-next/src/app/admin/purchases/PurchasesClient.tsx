"use client";

import React, { useTransition } from "react";
import POFilters from "./components/POFilters";
import POTable from "./components/POTable";

export default function PurchasesClient() {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <POFilters startTransition={startTransition} />
      <POTable isPending={isPending} />
    </>
  );
}
