/**
 * API request/response base types
 */

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export type ApiError = {
  statusCode: number;
  message: string;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}>;
