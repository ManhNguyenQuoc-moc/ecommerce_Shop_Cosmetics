"use client";

import { useState } from 'react';
import RewardsTable from "./components/RewardsTable";
import { Search } from "lucide-react";
import SWTInput from "@/src/@core/component/AntD/SWTInput";

export default function RewardsClient() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="admin-card p-6 flex flex-col gap-6">
      <div className="w-full md:w-[350px]">
        <SWTInput 
          placeholder="Tìm kiếm khách hàng theo tên, email, sđt..." 
          prefix={<Search size={18} className="text-text-sub mr-2" />}
          className="h-11 !rounded-full dark:!bg-slate-800/80 dark:!border-slate-700" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <RewardsTable searchTerm={searchTerm} />
    </div>
  );
}
