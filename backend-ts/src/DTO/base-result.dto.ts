/**
 * Base Result DTO
 * Standard response wrapper for all API endpoints
 */

export class BaseResultDto<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Array<{ path: string; message: string }>;

  constructor(payload: { data?: T; error?: string; message?: string; errors?: Array<{ path: string; message: string }> } | boolean, data?: T, error?: string, message?: string) {
    // Handle new format: new BaseResultDto({ data: ... })
    if (typeof payload === 'object' && !Array.isArray(payload)) {
      this.success = !payload.error;
      this.data = payload.data;
      this.message = payload.message || payload.error;
      this.errors = payload.errors;
    } else {
      // Handle old format: new BaseResultDto(true, data, error, message) - for backward compatibility
      this.success = payload as boolean;
      this.data = data;
      this.message = message || error;
    }
  }

  static ok<T>(data: T, message?: string): BaseResultDto<T> {
    return new BaseResultDto({ data, message });
  }

  static fail<T>(error: string, message?: string): BaseResultDto<T> {
    return new BaseResultDto({ error, message });
  }
}
