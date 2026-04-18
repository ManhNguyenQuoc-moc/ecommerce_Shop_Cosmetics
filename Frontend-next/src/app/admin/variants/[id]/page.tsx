"use client";

import dynamic from "next/dynamic";
import { use } from "react";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";

const VariantDetailClient = dynamic(() => import("./VariantDetailClient"), {
  loading: () => <SWTLoading tip="Đang tải thông tin biến thể..." />
});

export default function VariantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <VariantDetailClient id={id} />;
}
