"use client";
import UserTable from "./components/UserTable";
import UserFilters from "./components/UserFilters";
import useSWTTiltle from "@/src/@core/hooks/useSWTTitle";



export default function UsersPage() {

  useSWTTiltle("Quản lý người dùng");
  return (
    <div className="bg-bg-card backdrop-blur-md rounded-2xl shadow-sm border border-border-default p-6">
      <UserFilters />
      <UserTable />
    </div>
  );
}