"use client";

import React, { useState } from 'react';
import VoucherTable from "./components/VoucherTable";
import VoucherFilters from "./components/VoucherFilters";
import AddVoucherModal from "./components/AddVoucherModal";
import { VoucherResponseDto } from "@/src/services/models/voucher/output.dto";

export default function DiscountsClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<VoucherResponseDto | null>(null);

  const handleOpenAdd = () => {
    setEditingVoucher(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (voucher: VoucherResponseDto) => {
    setEditingVoucher(voucher);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors p-6">
      <VoucherFilters onAdd={handleOpenAdd} />
      <VoucherTable onEdit={handleOpenEdit} />
      
      <AddVoucherModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialData={editingVoucher}
      /> 
    </div>
  );
}
