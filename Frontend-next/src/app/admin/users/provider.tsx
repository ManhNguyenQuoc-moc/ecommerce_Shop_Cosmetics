"use client";
import React, { createContext, useCallback, useContext } from "react";
import { useUsers, useUpdateUserStatus, useUpdateUserRole, useUpdateUserAccountType } from "@/src/services/admin/user/user.hook";
import { showNotificationSuccess, showNotificationError } from "@/src/@core/utils/message";
import { UserProfileDTO } from "@/src/services/admin/user/models/output.model.dto";
import { UserQueryFilters } from "@/src/services/admin/user/models/input.model.dto";
import { BaseResultDto } from "@/src/@core/http/models/ApiResponse";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useRoles } from "@/src/services/admin/rbac/rbac.hooks";

export interface UserContextType {
  users: UserProfileDTO[];
  total: number;
  isLoading: boolean;
  filters: UserQueryFilters;
  pagination: {
    page: number;
    pageSize: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
  };
  handleSearch: (val: string) => void;
  handleFilterChange: (key: string, value: string) => void;
  handleToggleStatus: (user: UserProfileDTO) => Promise<void>;
  handleUpdateRole: (user: UserProfileDTO, roleId: string) => Promise<void>;
  handleUpdateAccountType: (user: UserProfileDTO, accountType: "CUSTOMER" | "INTERNAL") => Promise<void>;
  roles: { id: string; name: string }[];
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
  const roleId = searchParams.get("roleId") || "all";
  const accountType = searchParams.get("accountType") || "all";
  const status = searchParams.get("status") || "all";

  const filters: UserQueryFilters = { search, roleId, accountType: accountType as "CUSTOMER" | "INTERNAL" | undefined, status };
  const { users, total, isLoading: isInitialLoading, isValidating, mutate } = useUsers(page, pageSize, filters);
  const { trigger: updateStatusAction } = useUpdateUserStatus();
  const { trigger: updateRoleAction } = useUpdateUserRole();
  const { trigger: updateAccountTypeAction } = useUpdateUserAccountType();
  const { roles } = useRoles();

  const replaceIfChanged = useCallback((params: URLSearchParams) => {
    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery === currentQuery) return;

    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname);
  }, [pathname, router, searchParams]);

  const handleSearch = useCallback((val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set("search", val);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    replaceIfChanged(params);
  }, [replaceIfChanged, searchParams]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    replaceIfChanged(params);
  }, [replaceIfChanged, searchParams]);

  const handleToggleStatus = async (user: UserProfileDTO) => {
    const newStatus = user.is_banned ? "ACTIVE" : "BANNED";
    try {
      await updateStatusAction({ id: user.id, is_banned: !user.is_banned });
      
      showNotificationSuccess(
        `Đã ${newStatus === "ACTIVE" ? "mở khóa" : "khóa"} tài khoản thành công`
      );
      mutate();
    } catch (err: unknown) {
      const apiError = err as BaseResultDto;
      const errorMsg = apiError.error?.message || apiError.message || "Có lỗi xảy ra";
      showNotificationError(errorMsg);
    }
  };

  const handleUpdateRole = async (user: UserProfileDTO, roleId: string) => {
    try {
      await updateRoleAction({ id: user.id, roleId });
      const selectedRole = roles.find((item) => item.id === roleId);
      showNotificationSuccess(`Đã cập nhật quyền ${selectedRole?.name || roleId} thành công`);
      mutate();
    } catch (err: unknown) {
      const apiError = err as BaseResultDto;
      const errorMsg = apiError.error?.message || apiError.message || "Có lỗi xảy ra";
      showNotificationError(errorMsg);
    }
  };

  const handleUpdateAccountType = async (user: UserProfileDTO, accountType: "CUSTOMER" | "INTERNAL") => {
    try {
      await updateAccountTypeAction({ id: user.id, accountType });
      showNotificationSuccess(`Đã cập nhật loại tài khoản ${accountType} thành công`);
      mutate();
    } catch (err: unknown) {
      const apiError = err as BaseResultDto;
      const errorMsg = apiError.error?.message || apiError.message || "Có lỗi xảy ra";
      showNotificationError(errorMsg);
    }
  };

  const setPage = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    replaceIfChanged(params);
  }, [replaceIfChanged, searchParams]);

  const setPageSize = useCallback((size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", size.toString());
    params.set("page", "1");
    replaceIfChanged(params);
  }, [replaceIfChanged, searchParams]);

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
        handleUpdateAccountType,
        roles,
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