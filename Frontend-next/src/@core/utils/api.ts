import http from "@/src/@core/http";
import { ApiResponse } from "@/src/@core/http/models/ApiResponse";

const unwrapResponse = <T>(res: { data: ApiResponse<T> }): T => {
  const apiResponse = res.data;

  // Nếu API trả về success: false, chúng ta có thể handle thêm logic ở đây nếu cần
  // Tuy nhiên Interceptor của bạn thường đã handle status code rồi.
  
  // Trả về data (T) - Theo Interface của bạn, data luôn tồn tại trong ApiResponse<T>
  return apiResponse.data;
};

/**
 * Hàm GET: Sử dụng Record<string, any> là linh hoạt nhất cho params, 
 * nhưng khi gọi ở Service bạn nên truyền vào PaginationWithSearchRequestDto
 */
export async function get<T>(
  url: string,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.get<ApiResponse<T>>(url, { params });
  return unwrapResponse(res);
}

/**
 * Hàm POST: Hỗ trợ Generic D cho payload (data gửi đi)
 */
export async function post<T, D = any>(
  url: string,
  data?: D,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.post<ApiResponse<T>>(url, data, { params });
  return unwrapResponse(res);
}

/**
 * Hàm PUT
 */
export async function put<T, D = any>(
  url: string,
  data?: D,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.put<ApiResponse<T>>(url, data, { params });
  return unwrapResponse(res);
}

/**
 * Hàm PATCH
 */
export async function patch<T, D = any>(
  url: string,
  data?: D,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.patch<ApiResponse<T>>(url, data, { params });
  return unwrapResponse(res);
}

/**
 * Hàm DELETE
 */
export async function del<T>(
  url: string,
  params?: Record<string, any>
): Promise<T> {
  const res = await http.delete<ApiResponse<T>>(url, { params });
  return unwrapResponse(res);
}