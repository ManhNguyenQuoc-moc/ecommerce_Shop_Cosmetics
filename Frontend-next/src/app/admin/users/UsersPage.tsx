"use client";
import UserTable from "./components/UserTable";
import UserFilters from "./components/UserFilters";

export default function UsersPage() {
  return (
    <div className="bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default p-6">
      <UserFilters />
      <UserTable />
    </div>
  );
}