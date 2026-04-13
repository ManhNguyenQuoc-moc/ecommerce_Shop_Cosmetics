import { get, post } from "@/src/services/api";
import { useFetchSWR } from "@/src/@core/hooks/useFetchSWR";
import useSWRMutation from "swr/mutation";

export const SETTING_API_ENDPOINT = "/settings";

export const useGetSettings = () => {
  const { data, isLoading, error, mutate } = useFetchSWR<any>(
    SETTING_API_ENDPOINT,
    () => get(SETTING_API_ENDPOINT)
  );

  return {
    settings: data || {},
    isLoading,
    isError: error,
    mutate
  };
};

export const useUpdateSettings = () => {
  return useSWRMutation(
    SETTING_API_ENDPOINT,
    (_, { arg }: { arg: { point_percentage: number } }) =>
      post(SETTING_API_ENDPOINT, arg)
  );
};
