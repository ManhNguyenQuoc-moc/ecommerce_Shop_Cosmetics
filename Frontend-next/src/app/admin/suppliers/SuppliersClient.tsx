"use client";

import { useState } from 'react';
import useSWTTitle from "@/src/@core/hooks/useSWTTitle";
import BrandTable from "./components/BrandTable";
import BrandFilters from "./components/BrandFilters";
import AddBrandModal from "./components/AddBrandModal";

export default function SuppliersClient() {
  useSWTTitle("Quản lý Nhà cung cấp | Admin");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenAddModal = () => {
    setSelectedBrand(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (brand: any) => {
    setSelectedBrand(brand);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBrand(null);
  };

  return (
    <div className="admin-card p-6">
      
      <BrandFilters onAdd={handleOpenAddModal} onSearch={setSearchTerm} />
      <BrandTable onEdit={handleOpenEditModal} searchTerm={searchTerm} />
      
      <AddBrandModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        initialData={selectedBrand} 
      />
    </div>
  );
}
