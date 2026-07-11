export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ApiMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiMetadata {
  cached: boolean;
  cachedAt?: number;
  ttl?: number;
}

export type AsyncResult<T> = Promise<ApiResponse<T>>;
