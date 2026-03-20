import http from "@/src/@core/http";
import { ApiResponse } from "@/src/@core/type/api";

export async function get<T>(
  url: string,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.get<ApiResponse<T>>(url, { params });
  return res.data.data;
}

export async function post<T>(
  url: string,
  data?: any,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.post<ApiResponse<T>>(url, data, { params });
  return res.data.data;
}

export async function put<T>(
  url: string,
  data?: any,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.put<ApiResponse<T>>(url, data, { params });
  return res.data.data;
}

export async function patch<T>(
  url: string,
  data?: any,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.patch<ApiResponse<T>>(url, data, { params });
  return res.data.data;
}

export async function del<T>(
  url: string,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.delete<ApiResponse<T>>(url, { params });
  return res.data.data;
}