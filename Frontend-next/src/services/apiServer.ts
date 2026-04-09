import { ApiResponse } from "@/src/@core/type/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

type FetchOptions = RequestInit & {
  revalidate?: number;
  cache?: RequestCache;
  timeout?: number;
};

export async function getServer<T>(
  url: string,
  params?: Record<string, any>,
  options?: FetchOptions
): Promise<T> {
  const query = params ? "?" + new URLSearchParams(params).toString() : "";
  const { revalidate = 60, cache, timeout = 10000, ...fetchOptions } = options || {};

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const res = await fetch(`${baseURL}${url}${query}`, {
      method: "GET",
      signal: controller.signal,
      ...fetchOptions,
      ...(cache ? { cache } : { next: { revalidate } })
    });
    
    clearTimeout(id);

    if (!res.ok) {
      console.warn(`[Cảnh báo] Lỗi ${res.status} khi prerender API: ${url}`);
      return null as T; // Bỏ qua lỗi sập trang
    }

    const json: ApiResponse<T> = await res.json();
    return json.data;

  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`[Lỗi] Timeout (${timeout}ms) khi gọi API tại: ${url}`);
    } else {
      console.error(`[Lỗi] Không gọi được API lúc build tại: ${url}`, error);
    }
    return null as T; // Bỏ qua lỗi sập trang
  }
}