export interface ErrorResultDto {
    code?: string | null;
    message: string;
    details?: any | null;
}

export interface BaseResultDto {
    status: string;
    success: boolean;
    error: ErrorResultDto | null;
    statusCode: number;
    message: string;
    systemName: string;
}

export interface ApiResponse<T> extends BaseResultDto {
  data: T;
};