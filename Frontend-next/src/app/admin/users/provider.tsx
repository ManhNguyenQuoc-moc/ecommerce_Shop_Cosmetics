"use client";
import React, { createContext, useContext, useState } from "react";
import { useUsers, useUpdateUserStatus, useUpdateUserRole } from "@/src/services/admin/user/user.hook";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { UserProfileDTO } from "@/src/services/admin/user/models/output.model.dto";
import { BaseResultDto } from "@/src/@core/http/models/ApiResponse";

export interface UserContextType {
  users: UserProfileDTO[];
  total: number;
  isLoading: boolean;
  filters: {
    search: string;
    role: string;
    status: string;
  };
  pagination: {
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
  handleSearch: (val: string) => void;
  handleFilterChange: (key: string, value: any) => void;
  handleToggleStatus: (user: UserProfileDTO) => Promise<void>;
  handleUpdateRole: (user: UserProfileDTO, role: string) => Promise<void>;
  mutate: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [filters, setFilters] = useState({ search: "", role: "all", status: "all" });

  const { users, total, isLoading: isInitialLoading, isValidating, mutate } = useUsers(page, pageSize, filters);
  const { trigger: updateStatusAction } = useUpdateUserStatus();
  const { trigger: updateRoleAction } = useUpdateUserRole();

  const handleSearch = (val: string) => {
    setFilters((prev) => ({ ...prev, search: val }));
    setPage(1);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleToggleStatus = async (user: UserProfileDTO) => {
    const newStatus = user.is_banned ? "ACTIVE" : "BANNED";
    try {
      await updateStatusAction({ id: user.id, is_banned: !user.is_banned });
      
      showNotificationSuccess(
        `Đã ${newStatus === "ACTIVE" ? "mở khóa" : "khóa"} tài khoản thành công`
      );
      mutate();
    } catch (err: any) {
      const apiError = err as BaseResultDto;
      const errorMsg = apiError.error?.message || apiError.message || "Có lỗi xảy ra";
      showNotificationError(errorMsg);
    }
  };

  const handleUpdateRole = async (user: UserProfileDTO, role: string) => {
    try {
      await updateRoleAction({ id: user.id, role });
      showNotificationSuccess(`Đã cập nhật quyền ${role} thành công`);
      mutate();
    } catch (err: any) {
      const apiError = err as BaseResultDto;
      const errorMsg = apiError.error?.message || apiError.message || "Có lỗi xảy ra";
      showNotificationError(errorMsg);
    }
  };

  const isLoading = isInitialLoading || isValidating;

  return (
    <UserContext.Provider
      value={{
        users,
        total,
        isLoading,
        pagination: { page, pageSize, setPage, setPageSize },
        filters,
        handleSearch,
        handleFilterChange,
        handleToggleStatus,
        handleUpdateRole,
        mutate,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserModule = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUserModule must be used within UserProvider");
  return context;
};