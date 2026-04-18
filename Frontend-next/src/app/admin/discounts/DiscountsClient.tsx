"use client";

import { useState, useTransition } from 'react';
import VoucherTable from "./components/VoucherTable";
import VoucherFilters from "./components/VoucherFilters";
import AddVoucherModal from "./components/AddVoucherModal";
import { VoucherResponseDto } from "@/src/services/models/voucher/output.dto";
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";

export default function DiscountsClient() {
  useSWTTitle("Quản lý Voucher | Admin");
  const [isPending, startTransition] = useTransition();
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
    <div className="admin-card p-6">
      <VoucherFilters onAdd={handleOpenAdd} startTransition={startTransition} />
      <VoucherTable onEdit={handleOpenEdit} />

      <AddVoucherModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={editingVoucher}
      />
    </div>
  );
}
