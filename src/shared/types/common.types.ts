// ============================================================
// COMMON TYPES
// src/shared/types/common.types.ts
// ============================================================

export interface ApiError {
  message:    string;
  statusCode: number;
  errors?:    Record<string, string[]> | null;
}

export interface NavItem {
  title: string;
  href:  string;
  icon:  string;
  roles: string[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface SelectOption {
  value: string;
  label: string;
}
