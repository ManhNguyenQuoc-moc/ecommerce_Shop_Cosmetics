"use client";

import ChangePasswordForm from "./components/ChangePasswordForm";
import SWTCard from "@/src/@core/component/AntD/SWTCard";
import SWTPageHeader from "@/src/@core/component/AntD/SWTPageHeader";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ChangePasswordPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/profile" className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Thiết lập tài khoản</h1>
          <p className="text-gray-500 text-sm">Quản lý bảo mật cho tài khoản của bạn</p>
        </div>
      </div>

      <SWTCard className="!rounded-2xl !border-none !shadow-sm !p-8">
        <ChangePasswordForm />
      </SWTCard>
    </div>
  );
}
