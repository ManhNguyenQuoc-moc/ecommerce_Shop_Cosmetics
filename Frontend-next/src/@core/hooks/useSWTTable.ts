"use client";

import { useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useFetchSWR } from "./useFetchSWR";

interface TableOptions<T> {
  endpoint: string;
  fetcher: (page: number, pageSize: number, filters: Record<string, any>) => Promise<{ data: T[]; total: number }>;
  defaultPageSize?: number;
  initialFilters?: Record<string, any>;
  revalidateOnFocus?: boolean;
}

export const useSWTTable = <T>({
  endpoint,
  fetcher,
  defaultPageSize = 10,
  initialFilters = {},
  revalidateOnFocus = false,
}: TableOptions<T>) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // 1. Get current state from URL
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = Number(searchParams.get("pageSize")) || defaultPageSize;
  const searchTerm = searchParams.get("search") || "";

  // 2. Local filters state (initialized from URL if possible)
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);

  // 3. Memoized Key for SWR
  const swrKey = useMemo(() => {
    return [endpoint, page, pageSize, searchTerm, JSON.stringify(filters)];
  }, [endpoint, page, pageSize, searchTerm, filters]);

  // 4. Fetch data using SWR
  const { data, isLoading, error, mutate } = useFetchSWR(
    swrKey,
    () => fetcher(page, pageSize, { searchTerm, ...filters }),
    { revalidateOnFocus }
  );

  // 5. Navigation helpers
  const updateURL = useCallback((params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });
    router.replace(`${pathname}?${newParams.toString()}`);
  }, [searchParams, pathname, router]);

  const onPageChange = useCallback((newPage: number, newPageSize?: number) => {
    updateURL({
      page: newPage.toString(),
      pageSize: (newPageSize || pageSize).toString(),
    });
  }, [pageSize, updateURL]);

  const onSearch = useCallback((value: string) => {
    updateURL({
      search: value || null,
      page: "1", // Reset to page 1 on search
    });
  }, [updateURL]);

  const applyFilters = useCallback((newFilters: Record<string, any>) => {
    setFilters(newFilters);
    updateURL({ page: "1" });
  }, [updateURL]);

  return {
    dataSource: data?.data || [],
    total: data?.total || 0,
    isLoading,
    error,
    page,
    pageSize,
    searchTerm,
    filters,
    onPageChange,
    onSearch,
    applyFilters,
    mutate,
    pagination: {
      current: page,
      pageSize: pageSize,
      total: data?.total || 0,
      onChange: onPageChange,
      showSizeChanger: true,
    }
  };
};
