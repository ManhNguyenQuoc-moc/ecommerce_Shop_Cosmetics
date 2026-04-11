import axios, {
  AxiosError,
  AxiosInstance,
  HttpStatusCode,
  InternalAxiosRequestConfig,
} from "axios";
import { authStorage } from "../utils/authStorage";
import {
  AUTHORIZATION_KEY,
  TOKEN_TYPE_KEY,
  API_BASE_URL
} from "../const";
import { showNotificationError } from "../utils/message";

// Xử lý request trước khi gửi đi
const onRequestInterceptor = (config: InternalAxiosRequestConfig) => {
  const accessToken = authStorage.getToken();
  
  if (accessToken) {
    config.headers[AUTHORIZATION_KEY] = `${TOKEN_TYPE_KEY} ${accessToken}`;
  }
  
  if (config.params) {
    config.paramsSerializer = {
      serialize: (params: Record<string, any>) => {
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        });
        return searchParams.toString();
      }
    };
  }
  return config;
};

// Xử lý response lỗi sau khi nhận được
const onResponseInterceptor = async (error: AxiosError) => {
  if (error.code == "ERR_NETWORK") {
    showNotificationError("Lỗi kết nối đến máy chủ, vui lòng thử lại sau.");
    return Promise.reject(error);
  }

  // 401 => Unauthorized. Chuyển hướng về login nếu token không hợp lệ
  if (error.response && error.response.status === HttpStatusCode.Unauthorized) {
    if (typeof window !== "undefined") {
        authStorage.logout();
        // window.location.href = `/login`; // Tạm tắt redirect tự động để tránh loop
    }
    return Promise.reject(error.response.data);
  }

  const _response = error.response?.data as any;
  
  // 400 => Bad Request
  if (error.response && error.response.status === HttpStatusCode.BadRequest) {
    showNotificationError(
      `${_response?.message ?? "Lỗi không xác định, vui lòng liên hệ quản trị viên."}`,
    );
    return Promise.reject(error.response.data);
  }

  // 403 => Forbidden
  if (error.response && error.response.status === HttpStatusCode.Forbidden) {
    if (typeof window !== "undefined") window.location.href = `/403`;
    return Promise.reject(error.response.data);
  }

  // 404 => Not Found
  if (error.response && error.response.status === HttpStatusCode.NotFound) {
    // window.location.href = `/404`;
    return Promise.reject(error.response.data);
  }

  // 500 => Internal Server Error
  if (
    error.response &&
    error.response.status === HttpStatusCode.InternalServerError
  ) {
    showNotificationError(_response?.message || "Hệ thống đang gặp sự cố, vui lòng thử lại sau.");
    return Promise.reject(error.response.data || error);
  }

  // Hiển thị thông báo lỗi cho các lỗi khác
  if (_response?.message) {
    showNotificationError(_response.message);
  }
  
  return Promise.reject(error);
};

// Removed local API_BASE_URL definition
const http = axios.create({
  baseURL: API_BASE_URL, 
  timeout: 30 * 1000,
  headers: {
    "Content-Type": "application/json",
    "Accept-Language": "vi",
    "X-Requested-With": "XMLHttpRequest",
  },
});

const handleInterceptor = (http: AxiosInstance) => {
  http.interceptors.request.use(onRequestInterceptor, (error) =>
    Promise.reject(error),
  );
  http.interceptors.response.use((response) => response, onResponseInterceptor);
};

handleInterceptor(http);

export default http;
