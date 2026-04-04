import { ApiResponse } from "@/src/@core/type/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FetchOptions = RequestInit & {
  revalidate?: number;
  cache?: RequestCache;
};

export async function getServer<T>(
  url: string,
  params?: Record<string, any>,
  options?: FetchOptions
): Promise<T> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const { revalidate = 60, cache, ...fetchOptions } = options || {};

  try {
    const res = await fetch(`${baseURL}${url}${query}`, {
      method: "GET",
      ...fetchOptions,
      ...(cache ? { cache } : { next: { revalidate } })
    });

    if (!res.ok) {
      console.warn(`[Cảnh báo] Lỗi ${res.status} khi prerender API: ${url}`);
      return null as T; // Bỏ qua lỗi sập trang
    }

    const json: ApiResponse<T> = await res.json();
    return json.data;

  } catch (error) {
    console.error(`[Lỗi] Không gọi được API lúc build tại: ${url}`, error);
    return null as T; // Bỏ qua lỗi sập trang
  }
}