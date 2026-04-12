"use client";

import React, { useState } from 'react';
import UserTable from "./components/UserTable";
import UserFilters from "./components/UserFilters";

export default function UsersClient() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-6 bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default dark:border-border-brand transition-colors">
      <UserFilters onSearch={setSearchTerm} />
      <UserTable searchTerm={searchTerm} />
    </div>
  );
}
