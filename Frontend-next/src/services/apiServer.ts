import { ApiResponse } from "@/src/@core/type/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
console.log("BASE URL:", baseURL);
type FetchOptions = RequestInit & {
  revalidate?: number;
  cache?: RequestCache;
};

export async function getServer<T>(
  url: string,
  params?: Record<string, any>,
  options?: FetchOptions
): Promise<T> {

  const query = params
    ? "?" + new URLSearchParams(params).toString()
    : "";

  const {
    revalidate = 60,
    cache,
    ...fetchOptions
  } = options || {};

  const res = await fetch(`${baseURL}${url}${query}`, {
    method: "GET",
    ...fetchOptions,

    ...(cache
      ? { cache }
      : {
          next: { revalidate }
        })
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  const json: ApiResponse<T> = await res.json();

  return json.data;
}