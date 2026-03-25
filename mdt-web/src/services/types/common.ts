export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface SortParams {
  field?: string;
  order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  [key: string]: any;
}

export interface TableParams extends PaginationParams, SortParams, FilterParams {}

export interface Option {
  label: string;
  value: string | number;
}