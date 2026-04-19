import { get, put, patch } from "@/src/@core/utils/api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { PaginationResponse } from "@/src/@core/http/models/PaginationResponse";
import { UserProfileDTO } from "./models/output.model.dto";
import { UserQueryFilters } from "./models/input.model.dto";
export const USER_API_ENDPOINT = "/users";

export const useUsers = (page: number = 1, pageSize: number = 6, filters: UserQueryFilters = {}) => {
  const query = buildQueryString({
    page,
    pageSize,
    ...filters
  });

  const { data, isLoading, isValidating, error, mutate } = useFetchSWR<PaginationResponse<UserProfileDTO>>(
    `${USER_API_ENDPOINT}${query}`,
    () => get(`${USER_API_ENDPOINT}${query}`)
  );

  return {
    users: (data as PaginationResponse<UserProfileDTO>)?.data || [],
    total: data?.total || 0,
    isLoading,
    isValidating,
    isError: error,
    mutate
  };
};

export const useUpdateUserStatus = () => {
  return useSWRMutation(
    USER_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; is_banned: boolean } }) =>
      put(`${USER_API_ENDPOINT}/${arg.id}/status`, { is_banned: arg.is_banned })
  );
};

export const useUpdateUserRole = () => {
  return useSWRMutation(
    USER_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; roleId: string } }) =>
      put(`${USER_API_ENDPOINT}/${arg.id}/role`, { roleId: arg.roleId })
  );
};

export const useUpdateUserAccountType = () => {
  return useSWRMutation(
    USER_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; accountType: "CUSTOMER" | "INTERNAL" } }) =>
      put(`${USER_API_ENDPOINT}/${arg.id}/account-type`, { accountType: arg.accountType })
  );
};

export const useUserProfile = () => {
  return useFetchSWR<UserProfileDTO>(
    `${USER_API_ENDPOINT}/me`,
    () => get(`${USER_API_ENDPOINT}/me`)
  );
};

export const useToggleWalletLock = () => {
  return useSWRMutation(
    USER_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; isLocked: boolean } }) =>
      patch(`${USER_API_ENDPOINT}/${arg.id}/wallet-status`, { isLocked: arg.isLocked })
  );
};

export const usePointHistory = (id: string | null) => {
  const { data, isLoading, error } = useFetchSWR<unknown[]>(
    id ? `${USER_API_ENDPOINT}/${id}/points` : null,
    () => id ? get(`${USER_API_ENDPOINT}/${id}/points`) : Promise.resolve([] as unknown[])
  );
  return { history: data || [], isLoading, isError: error };
};
