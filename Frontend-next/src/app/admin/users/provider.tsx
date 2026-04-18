"use client";
import React, { createContext, useContext } from "react";
import { useUsers, useUpdateUserStatus, useUpdateUserRole } from "@/src/services/admin/user/user.hook";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { UserProfileDTO } from "@/src/services/admin/user/models/output.model.dto";
import { BaseResultDto } from "@/src/@core/http/models/ApiResponse";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

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
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const page = Number(searchParams.get("page") ?? 1);
  const pageSize = Number(searchParams.get("pageSize") ?? 6);
  const search = searchParams.get("search") || "";
  const role = searchParams.get("role") || "all";
  const status = searchParams.get("status") || "all";

  const filters = { search, role, status };
  const { users, total, isLoading: isInitialLoading, isValidating, mutate } = useUsers(page, pageSize, filters);
  const { trigger: updateStatusAction } = useUpdateUserStatus();
  const { trigger: updateRoleAction } = useUpdateUserRole();

  const handleSearch = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleFilterChange = (key: string, value: any) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
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

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.replace(`${pathname}?${params.toString()}`);
  };

  const setPageSize = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", size.toString());
    params.set("page", "1");
    router.replace(`${pathname}?${params.toString()}`);
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