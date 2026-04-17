// ============================================================
// PROTECTED ROUTE — uses real authStore
// src/components/ProtectedRoute.tsx
// ============================================================
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import type { UserRole } from '@/modules/auth/types/auth.types';

interface Props {
  children: React.ReactNode;
  roles?:   UserRole[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !user) return <Navigate to="/login" replace />;

  // If roles specified, check user's computed frontend role OR backend role names
  if (roles && roles.length > 0) {
    const userFrontendRole = user.role;
    const userBackendRoles = user.roles.map((r) => r.toLowerCase());

    const hasAccess = roles.some((requiredRole) => {
      // Direct match on computed frontend role
      if (userFrontendRole === requiredRole) return true;
      // SuperAdmin/Admin always pass
      if (userBackendRoles.includes('superadmin') || userBackendRoles.includes('admin')) return true;
      // Map frontend role names to backend role names
      const map: Record<string, string[]> = {
        admin:     ['superadmin', 'admin'],
        seller:    ['salesmanager', 'inventorymanager'],
        warehouse: ['warehousemanager', 'purchasemanager'],
        delivery:  [],
        viewer:    ['viewer', 'accountant'],
        superadmin:['superadmin'],
      };
      return (map[requiredRole] ?? []).some((br) => userBackendRoles.includes(br));
    });

    if (!hasAccess) return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
