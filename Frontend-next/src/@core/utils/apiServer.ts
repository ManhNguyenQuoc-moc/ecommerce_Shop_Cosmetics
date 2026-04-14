import { ApiResponse } from "@/src/@core/http/models/ApiResponse";
import { buildQueryString } from "./query.util";
import { API_BASE_URL } from "../const";

const baseURL = API_BASE_URL;

type FetchOptions = RequestInit & {
  revalidate?: number;
  cache?: RequestCache;
  timeout?: number;
};

/**
 * Hàm getServer dành cho Server Components (SEO, Pre-render)
 * Tận dụng tính năng caching của Next.js fetch
 */
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
      // Ưu tiên cache nếu có, nếu không thì dùng revalidate (ISR)
      ...(cache ? { cache } : { next: { revalidate } })
    });
    
    clearTimeout(id);

    if (!res.ok) {
      console.warn(`[Cảnh báo] Lỗi ${res.status} khi prerender API: ${url}`);
      // Trả về null hoặc ném lỗi tùy thuộc vào logic của bạn
      // Ở đây ép kiểu để giữ tính nhất quán cho Promise<T>
      return null as unknown as T;
    }

    const json: ApiResponse<T> = await res.json();

    // CHUẨN HÓA LOGIC BÓC TÁCH: 
    // Theo Interface của bạn, ApiResponse kế thừa BaseResultDto và có data: T
    // Nếu API thành công, ta luôn lấy json.data
    if (json && json.data !== undefined) {
      return json.data;
    }

    // Trường hợp dự phòng nếu API trả về cấu trúc thô (fallback)
    return json as unknown as T;

  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`[Lỗi] Timeout (${timeout}ms) khi gọi API tại: ${url}`);
    } else {
      console.error(`[Lỗi] Không gọi được API lúc build tại: ${url}`, error);
    }
    return null as unknown as T;
  }
}