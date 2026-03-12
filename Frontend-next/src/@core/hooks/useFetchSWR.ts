import useSWR, { Key } from "swr";

export const useFetchSWR = <T>(key: Key, fetcher: () => Promise<T>) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(key, fetcher);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
};