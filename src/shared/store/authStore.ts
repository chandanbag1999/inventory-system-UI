// ============================================================
// AUTH STORE — Zustand + persist, wired to real backend
// src/shared/store/authStore.ts
// ============================================================
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import apiClient from '../services/api/apiClient';
import { API_ENDPOINTS } from '../services/api/endpoints';
import type {
  AuthState,
  AuthUser,
  AuthResponse,
  LoginCredentials,
  Resource,
  Action,
  UserRole,
} from '@/modules/auth/types/auth.types';

// ── Map backend role names → frontend UserRole ───────────────
// Used by ProtectedRoute which checks 'admin' | 'seller' etc.
function mapToFrontendRole(backendRoles: string[]): UserRole {
  const lower = backendRoles.map((r) => r.toLowerCase());
  if (lower.includes('superadmin') || lower.includes('admin')) return 'admin';
  if (lower.includes('salesmanager') || lower.includes('inventorymanager')) return 'seller';
  if (lower.includes('warehousemanager') || lower.includes('purchasemanager')) return 'warehouse';
  if (lower.includes('accountant')) return 'viewer';
  return 'viewer';
}

// ── Normalise permission check ───────────────────────────────
// Backend permissions: "Products.View", "Categories.Create" etc.
// Frontend calls: hasPermission('product', 'create') or ('Products', 'View')
function normaliseResource(resource: Resource): string {
  const map: Record<string, string> = {
    product:        'Products',
    category:       'Categories',
    warehouse:      'Warehouses',
    stock:          'Stocks',
    supplier:       'Suppliers',
    order:          'SalesOrders',
    user:           'Users',
  };
  return map[resource as string] ?? resource;
}

function normaliseAction(action: Action): string {
  const map: Record<string, string> = {
    view:   'View',
    create: 'Create',
    update: 'Edit',
    delete: 'Delete',
    read:   'View',
  };
  return map[action as string] ?? action;
}

// ── Store ─────────────────────────────────────────────────────
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user:            null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,
      permissions:     [],

      setTokens: (accessToken, refreshToken) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        set({ accessToken, refreshToken });
      },

      login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await apiClient.post<{ success: boolean; data: AuthResponse }>(
          API_ENDPOINTS.AUTH.LOGIN,
          credentials
        );
        const response = data.data;
        const user: AuthUser = {
          ...response.user,
          role: mapToFrontendRole(response.user.roles),
        };

        localStorage.setItem('accessToken',  response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);

        set({
          user,
          accessToken:     response.accessToken,
          refreshToken:    response.refreshToken,
          isAuthenticated: true,
          permissions:     response.user.permissions,
        });

        return { ...response, user };
      },

      logout: async () => {
        const { refreshToken } = get();
        try {
          if (refreshToken) {
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, { refreshToken });
          }
        } catch {
          // ignore logout errors — always clear local state
        } finally {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          set({
            user:            null,
            accessToken:     null,
            refreshToken:    null,
            isAuthenticated: false,
            permissions:     [],
          });
        }
      },

      getMe: async (): Promise<AuthUser> => {
        const { data } = await apiClient.get<{ success: boolean; data: AuthUser }>(
          API_ENDPOINTS.AUTH.ME
        );
        const user: AuthUser = {
          ...data.data,
          role: mapToFrontendRole(data.data.roles ?? []),
        };
        set({ user, permissions: data.data.permissions ?? [], isAuthenticated: true });
        return user;
      },

      hasPermission: (resource: Resource, action: Action): boolean => {
        const { permissions, user } = get();
        if (!user) return false;
        // SuperAdmin / Admin always have all permissions
        if (user.roles.some((r) => ['SuperAdmin', 'Admin'].includes(r))) return true;
        const res = normaliseResource(resource);
        const act = normaliseAction(action);
        return permissions.includes(`${res}.${act}`);
      },

      hasRole: (...roles: UserRole[]): boolean => {
        const { user } = get();
        if (!user) return false;
        return roles.includes(user.role);
      },

      isAdmin: () => {
        const { user } = get();
        if (!user) return false;
        return user.roles.some((r) => ['SuperAdmin', 'Admin'].includes(r));
      },
    }),
    {
      name:    'auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user:            state.user,
        accessToken:     state.accessToken,
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        permissions:     state.permissions,
      }),
    }
  )
);
