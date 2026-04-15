// ============================================================
// AUTH STORE - Enterprise Grade with JWT Support
// src/shared/store/authStore.ts
// ============================================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  User,
  UserRole,
  Permission,
  Resource,
  Action,
} from '@/modules/auth/types/auth.types';
import { tokenStorage } from '@/shared/services/api/apiClient';
import { authService, type LoginRequest, type RegisterRequest } from '@/shared/services/authService';

const roleMapping: Record<string, UserRole> = {
  'SuperAdmin': 'admin',
  'Admin': 'admin',
  'InventoryManager': 'warehouse',
  'SalesManager': 'seller',
  'Staff': 'delivery',
};

const mapBackendRoleToFrontend = (backendRole: string): UserRole => {
  return roleMapping[backendRole] || 'admin';
};

const mapBackendPermissionsToFrontend = (permissions: string[]): Permission[] => {
  return permissions as Permission[];
};

interface AuthStore {
  user:            User | null;
  accessToken:     string | null;
  refreshToken:    string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  isMFARequired:   boolean;
  permissions:     Permission[];
  sessionExpiry:   string | null;

  login:          (credentials: LoginRequest) => Promise<boolean>;
  register:       (data: RegisterRequest) => Promise<boolean>;
  loginWithToken: (user: User, tokens: { accessToken: string; refreshToken: string }) => void;
  logout:         () => Promise<void>;
  setUser:        (user: User) => void;
  setLoading:     (loading: boolean) => void;
  updateTokens:   (accessToken: string, refreshToken?: string) => void;

  hasPermission:  (resource: Resource, action: Action) => boolean;
  hasRole:        (...roles: UserRole[]) => boolean;
  isAdmin:        () => boolean;
  isSeller:       () => boolean;
  isWarehouse:    () => boolean;
  isDelivery:     () => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user:            null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,
      isLoading:       false,
      isMFARequired:   false,
      permissions:     [],
      sessionExpiry:   null,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.login(credentials);
          const { accessToken, refreshToken, user: backendUser } = response;
          
          tokenStorage.setAccess(accessToken);
          tokenStorage.setRefresh(refreshToken);
          
          const frontendUser: User = {
            id: backendUser.id,
            name: backendUser.name || backendUser.firstName + ' ' + backendUser.lastName || backendUser.email,
            email: backendUser.email,
            role: mapBackendRoleToFrontend(backendUser.role || backendUser.roles[0]),
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLoginAt: backendUser.lastLoginAt,
          };
          
          const perms = mapBackendPermissionsToFrontend(backendUser.permissions || []);
          
          set({
            user: frontendUser,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            permissions: perms,
            isLoading: false,
            sessionExpiry: accessToken ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false });
          console.error('Login failed:', error);
          return false;
        }
      },

      register: async (data: RegisterRequest) => {
        set({ isLoading: true });
        try {
          const response = await authService.register(data);
          const { accessToken, refreshToken, user: backendUser } = response;
          
          tokenStorage.setAccess(accessToken);
          tokenStorage.setRefresh(refreshToken);
          
          const frontendUser: User = {
            id: backendUser.id,
            name: backendUser.name || backendUser.firstName + ' ' + backendUser.lastName || backendUser.email,
            email: backendUser.email,
            role: mapBackendRoleToFrontend(backendUser.role || backendUser.roles[0]),
            isActive: true,
            createdAt: new Date().toISOString(),
            lastLoginAt: backendUser.lastLoginAt,
          };
          
          const perms = mapBackendPermissionsToFrontend(backendUser.permissions || []);
          
          set({
            user: frontendUser,
            accessToken,
            refreshToken,
            isAuthenticated: true,
            permissions: perms,
            isLoading: false,
            sessionExpiry: accessToken ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null,
          });
          
          return true;
        } catch (error) {
          set({ isLoading: false });
          console.error('Registration failed:', error);
          return false;
        }
      },

      loginWithToken: (user, tokens) => {
        tokenStorage.setAccess(tokens.accessToken);
        tokenStorage.setRefresh(tokens.refreshToken);
        set({
          user,
          isAuthenticated: true,
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          sessionExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });
      },

      logout: async () => {
        const { refreshToken } = get();
        try {
          if (refreshToken) {
            await authService.logout(refreshToken);
          }
        } catch (error) {
          console.error('Logout API call failed:', error);
        } finally {
          tokenStorage.clearAll();
          set({
            user:            null,
            accessToken:     null,
            refreshToken:    null,
            isAuthenticated: false,
            permissions:     [],
            sessionExpiry:   null,
            isMFARequired:   false,
          });
        }
      },

      setUser:    (user)      => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),

      updateTokens: (accessToken, refreshToken) => {
        tokenStorage.setAccess(accessToken);
        if (refreshToken) tokenStorage.setRefresh(refreshToken);
        set({ accessToken, ...(refreshToken ? { refreshToken } : {}) });
      },

      hasPermission: (resource, action) => {
        const { permissions } = get();
        return permissions.includes((resource + ':' + action) as Permission);
      },

      hasRole: (...roles) => {
        const { user } = get();
        return !!user && roles.includes(user.role);
      },

      isAdmin:     () => get().hasRole('admin'),
      isSeller:    () => get().hasRole('seller'),
      isWarehouse: () => get().hasRole('warehouse'),
      isDelivery:  () => get().hasRole('delivery'),
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({
        user:            state.user,
        accessToken:     state.accessToken,
        refreshToken:    state.refreshToken,
        isAuthenticated: state.isAuthenticated,
        permissions:     state.permissions,
        sessionExpiry:   state.sessionExpiry,
      }),
    }
  )
);
