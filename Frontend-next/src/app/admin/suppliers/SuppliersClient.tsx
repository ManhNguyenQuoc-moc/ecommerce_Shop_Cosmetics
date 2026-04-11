"use client";

import React, { useState } from 'react';
import BrandTable from "./components/BrandTable";
import BrandFilters from "./components/BrandFilters";
import AddBrandModal from "./components/AddBrandModal";

export default function SuppliersClient() {
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
    <div className="p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
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
