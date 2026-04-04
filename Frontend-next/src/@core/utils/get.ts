// Thêm fallback ở đây nữa
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const rootPath = (path: string): string => {
  // Loại bỏ dấu '/' ở đầu path nếu có để tránh bị nối thành 'http://localhost:5000//path'
  const cleanPath = path.startsWith('/') ? path : `/${path}`; 
  return API_BASE_URL + cleanPath;
};

const tableId = (page: number, fetch: number, index: number): number => (page - 1) * fetch + index + 1;

const slugString = (slug: string | string[] | undefined): string => {
  if (Array.isArray(slug)) return "";
  return slug ?? "";
};

export const get = {
  rootPath,
  tableId,
  slugString,
};