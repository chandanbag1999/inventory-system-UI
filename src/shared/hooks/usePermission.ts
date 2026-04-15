// ============================================================
// USE PERMISSION HOOK
// src/shared/hooks/usePermission.ts
// ============================================================

import { useAuthStore } from '@/shared/store/authStore';
import type { Resource, Action, UserRole } from '@/modules/auth/types/auth.types';

export function usePermission() {
  const { hasPermission, hasRole, user, permissions } = useAuthStore();

  const can = (resource: Resource, action: Action): boolean =>
    hasPermission(resource, action);

  const canAny = (
    checks: Array<{ resource: Resource; action: Action }>
  ): boolean =>
    checks.some(({ resource, action }) => hasPermission(resource, action));

  const canAll = (
    checks: Array<{ resource: Resource; action: Action }>
  ): boolean =>
    checks.every(({ resource, action }) => hasPermission(resource, action));

  const isRole = (...roles: UserRole[]): boolean => hasRole(...roles);

  return {
    can,
    canAny,
    canAll,
    isRole,
    user,
    permissions,
    isAdmin:     () => hasRole('admin'),
    isSeller:    () => hasRole('seller'),
    isWarehouse: () => hasRole('warehouse'),
    isDelivery:  () => hasRole('delivery'),
  };
}
