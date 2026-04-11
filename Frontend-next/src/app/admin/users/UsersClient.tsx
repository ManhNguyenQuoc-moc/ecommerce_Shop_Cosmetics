"use client";

import React, { useState } from 'react';
import UserTable from "./components/UserTable";
import UserFilters from "./components/UserFilters";

export default function UsersClient() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 dark:border-admin-sidebar-border transition-colors">
      <UserFilters onSearch={setSearchTerm} />
      <UserTable searchTerm={searchTerm} />
    </div>
  );
}
