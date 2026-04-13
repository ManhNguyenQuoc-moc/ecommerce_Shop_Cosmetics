import { ApiResponse } from "@/src/@core/type/api";
import { buildQueryString } from "../@core/utils/query.util";
import { API_BASE_URL } from "../@core/const";

const baseURL = API_BASE_URL;

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
  const query = params ? buildQueryString(params) : "";
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
      return null as T;
    }

    const json: ApiResponse<T> = await res.json();
    return json.data !== undefined ? json.data : (json as any);

  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`[Lỗi] Timeout (${timeout}ms) khi gọi API tại: ${url}`);
    } else {
      console.error(`[Lỗi] Không gọi được API lúc build tại: ${url}`, error);
    }
    return null as T;
  }
}