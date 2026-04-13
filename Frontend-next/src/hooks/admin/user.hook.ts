import { get, post, put, patch } from "@/src/services/api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";
import { buildQueryString } from "@/src/@core/utils/query.util";
import { PaginationResponse } from "@/src/services/models/common/PaginationResponse";

export const USER_API_ENDPOINT = "/users";

export const useUsers = (page: number = 1, pageSize: number = 6, filters: any = {}) => {
  const query = buildQueryString({
    page,
    pageSize,
    ...filters
  });

  const { data, isLoading, error, mutate } = useFetchSWR<PaginationResponse<any>>(
    `${USER_API_ENDPOINT}${query}`,
    () => get(`${USER_API_ENDPOINT}${query}`)
  );

  return {
    users: (data as any)?.items || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate
  };
};

export const useUpdateUserStatus = () => {
  return useSWRMutation(
    USER_API_ENDPOINT,
    (_, { arg }: { arg: { id: string; status: string } }) =>
      put(`${USER_API_ENDPOINT}/${arg.id}/status`, { status: arg.status })
  );
};

export const useUserProfile = () => {
  return useFetchSWR<any>(
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
    
  const { data, isLoading, error } = useFetchSWR<any[]>(
    id ? `${USER_API_ENDPOINT}/${id}/points` : null,
    () => id ? get(`${USER_API_ENDPOINT}/${id}/points`) : Promise.resolve([] as any[])
  );
  return { history: data || [], isLoading, isError: error };
};
