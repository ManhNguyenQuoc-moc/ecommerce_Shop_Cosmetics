"use client"

import dynamic from "next/dynamic";
import { use } from "react";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";

const ProductDetailClient = dynamic(() => import("./ProductDetailClient"), {
  loading: () => <SWTLoading tip="Đang tải thông tin sản phẩm..." />
});

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  return <ProductDetailClient id={id} />;
}