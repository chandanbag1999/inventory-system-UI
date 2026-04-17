// ============================================================
// AUTH TYPES — aligned with backend UserInfoDto
// Backend roles: SuperAdmin, Admin, InventoryManager,
//   WarehouseManager, PurchaseManager, SalesManager,
//   Accountant, Viewer
// Backend permissions: "Module.Action" e.g. "Products.View"
// src/modules/auth/types/auth.types.ts
// ============================================================

// ── Backend role names (exact strings from seeded Roles table)
export type BackendRole =
  | 'SuperAdmin'
  | 'Admin'
  | 'InventoryManager'
  | 'WarehouseManager'
  | 'PurchaseManager'
  | 'SalesManager'
  | 'Accountant'
  | 'Viewer';

// ── Keep legacy UserRole for ProtectedRoute compatibility
// Maps frontend nav role names → backend role groups
export type UserRole = 'admin' | 'seller' | 'warehouse' | 'delivery' | 'superadmin' | 'viewer';

// ── Permission modules (backend Module field)
export type Resource =
  | 'Users'
  | 'Roles'
  | 'Categories'
  | 'Products'
  | 'Warehouses'
  | 'Stocks'
  | 'Suppliers'
  | 'PurchaseOrders'
  | 'SalesOrders'
  // legacy aliases used in existing frontend code
  | 'product'
  | 'category'
  | 'warehouse'
  | 'stock'
  | 'supplier'
  | 'order'
  | 'user';

// ── Permission actions (backend Action part)
export type Action =
  | 'View'
  | 'Create'
  | 'Edit'
  | 'Delete'
  | 'Adjust'
  | 'Approve'
  | 'Receive'
  | 'Cancel'
  | 'Ship'
  | 'Deliver'
  | 'AssignRole'
  // legacy aliases
  | 'view'
  | 'create'
  | 'update'
  | 'delete'
  | 'read';

// ── User object — matches backend UserInfoDto exactly
export interface AuthUser {
  id:              string;
  fullName:        string;
  email:           string;
  phone?:          string | null;
  profileImageUrl?:string | null;
  status:          string;
  isEmailVerified: boolean;
  roles:           string[];           // e.g. ["Admin", "InventoryManager"]
  permissions:     string[];           // e.g. ["Products.View", "Products.Create"]
  lastLoginAt?:    string | null;
  createdAt:       string;
  // Computed helper — primary role mapped to frontend UserRole
  role:            UserRole;
}

// Legacy alias used throughout existing pages
export type User = AuthUser;

// ── Login request
export interface LoginCredentials {
  email:    string;
  password: string;
}

// ── Register request
export interface RegisterData {
  fullName: string;
  email:    string;
  password: string;
  phone?:   string;
}

// ── Backend login response (data field of ApiResponse)
export interface AuthResponse {
  accessToken:  string;
  refreshToken: string;
  expiresIn:    number;
  tokenType:    string;
  user:         AuthUser;
}

// ── Zustand auth store state + actions
export interface AuthState {
  user:            AuthUser | null;
  accessToken:     string | null;
  refreshToken:    string | null;
  isAuthenticated: boolean;
  permissions:     string[];

  login:           (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout:          () => Promise<void>;
  getMe:           () => Promise<AuthUser>;
  setTokens:       (accessToken: string, refreshToken: string) => void;
  hasPermission:   (resource: Resource, action: Action) => boolean;
  hasRole:         (...roles: UserRole[]) => boolean;
  isAdmin:         () => boolean;
}
