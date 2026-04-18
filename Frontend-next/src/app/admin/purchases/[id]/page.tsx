"use client"

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import SWTLoading from "@/src/@core/component/AntD/SWTLoading";

const PODetailClient = dynamic(() => import("./PODetailClient"), {
  ssr: false,
  loading: () => <SWTLoading tip="Đang tải thông tin phiếu nhập..." />
});

export default function PODetailPage() {
  const params = useParams() as { id: string };
  const id = params.id;

  return <PODetailClient id={id} />;
}
