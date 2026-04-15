// ============================================================
// AUTH TYPES
// src/modules/auth/types/auth.types.ts
// ============================================================

export type UserRole = 'admin' | 'seller' | 'warehouse' | 'delivery';

export type Resource =
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'inventory'
  | 'warehouses'
  | 'deliveries'
  | 'stock_movements'
  | 'suppliers'
  | 'returns'
  | 'analytics'
  | 'notifications'
  | 'users'
  | 'settings'
  | 'audit';

export type Action =
  | 'view'
  | 'create'
  | 'edit'
  | 'delete'
  | 'export'
  | 'approve'
  | 'assign';

export type Permission = string;

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  timezone?: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isMFARequired: boolean;
  permissions: Permission[];
  sessionExpiry: string | null;
}

export interface MFAVerification {
  code: string;
  method: 'totp' | 'sms' | 'email';
}

export interface PasswordReset {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
}
