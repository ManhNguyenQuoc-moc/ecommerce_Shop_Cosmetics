import { ApiResponse } from "@/src/@core/type/api";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

type FetchOptions = RequestInit & {
  revalidate?: number;
};

export async function getServer<T>(
  url: string,
  params?: Record<string, any>,
  options?: FetchOptions
): Promise<T> {

  const query = params
    ? "?" + new URLSearchParams(params).toString()
    : "";

  const { revalidate = 60, ...fetchOptions } = options || {};

  const res = await fetch(`${baseURL}${url}${query}`, {
    method: "GET",
    ...fetchOptions,
    next: {
      revalidate
    }
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status}`);
  }

  const json: ApiResponse<T> = await res.json();

  return json.data;
}