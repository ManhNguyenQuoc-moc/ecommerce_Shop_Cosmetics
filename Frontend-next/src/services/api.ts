import { apiClient } from "./apiClient";
import { ApiResponse } from "@/src/@core/type/api";

export async function get<T>(
  url: string,
  params?: Record<string, any>
): Promise<T> {
  const res = await apiClient.get<ApiResponse<T>>(url, { params });

  return res.data.data;
}