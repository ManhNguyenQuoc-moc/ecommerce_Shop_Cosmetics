import useSWR, { Key, SWRConfiguration } from "swr";

export const useFetchSWR = <T>(
  key: Key,
  fetcher: () => Promise<T>,
  options?: SWRConfiguration
) => {
  const { data, error, isLoading, isValidating, mutate } = useSWR<T>(
    key,
    fetcher,
    options
  );

  return { data, error, isLoading, isValidating, mutate };
};