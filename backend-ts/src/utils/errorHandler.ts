import { Response } from "express";
import { z } from "zod";

interface ErrorResponse {
  success: false;
  message: string;
  errors?: Array<{ path: string; message: string }>;
}

/**
 * Xử lý lỗi chung từ controllers
 * - ZodError (validation)
 * - Prisma errors (database constraints)
 * - Custom errors
 */
export const handleControllerError = (res: Response, error: any, controllerName: string = "Controller"): void => {
  // Log error để debug
  console.error(`${controllerName} Error:`, error);

  // Handle Zod validation errors
  if (error instanceof z.ZodError) {
    const response: ErrorResponse = {
      success: false,
      message: "Validation failed",
      errors: error.issues.map(err => ({
        path: err.path.join('.'),
        message: err.message
      }))
    };
    res.status(400).json(response);
    return;
  }

  // Determine HTTP status code based on error message or type
  let statusCode = 500;
  let message = error.message || "Internal server error";

  // Check for common error patterns that should be 400 (Bad Request)
  const badRequestPatterns = [
    "đã được sử dụng",
    "đã được đăng ký",
    "Ngày sinh không thể",
    "Bạn phải đủ",
    "không hợp lệ",
    "không tồn tại",
    "không được phép",
    "không có quyền"
  ];

  const isBadRequest = badRequestPatterns.some(pattern => message.includes(pattern));
  
  if (isBadRequest) {
    statusCode = 400;
  } else if (error.status) {
    statusCode = error.status;
  }

  const response: ErrorResponse = {
    success: false,
    message
  };

  res.status(statusCode).json(response);
};
