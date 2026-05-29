export interface ApiError {
  message: string;
  detail?: string;
  errors?: string[];
  traceId?: string;
}

export interface ValidationError {
  field: string;
  message: string;
}