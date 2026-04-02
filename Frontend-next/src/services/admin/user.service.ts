import { get, post, put } from "../api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";

export const USER_API_ENDPOINT = "/users";

export const useUsers = (page: number = 1, pageSize: number = 6, filters: any = {}) => {
  const query = new URLSearchParams({
    page: page.toString(),
    pageSize: pageSize.toString(),
    ...(filters.search && { search: filters.search }),
    ...(filters.role && filters.role !== 'all' && { role: filters.role }),
  });

  const { data, isLoading, error, mutate } = useFetchSWR(
    `${USER_API_ENDPOINT}/all?${query.toString()}`,
    () => get(`${USER_API_ENDPOINT}/all?${query.toString()}`)
  );

  return {
    users: (data as any)?.data?.items || [],
    total: (data as any)?.data?.total || 0,
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
