// ============================================================
// SHARED COMMON TYPES
// src/shared/types/common.types.ts
// ============================================================

export type ID = string;

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: Record<string, any>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
  statusCode: number;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DateRange {
  from: Date;
  to: Date;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  search?: string;
  page: number;
  pageSize: number;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  dateRange?: DateRange;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  gstin?: string;
}

export interface TableColumn<T> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export type ActionStatus = 'idle' | 'loading' | 'success' | 'error';

export interface BulkAction {
  label: string;
  icon?: string;
  variant?: 'default' | 'destructive';
  action: (ids: string[]) => void;
}
