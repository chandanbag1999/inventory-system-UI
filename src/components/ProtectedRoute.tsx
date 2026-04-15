import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import type { UserRole } from '@/modules/auth/types/auth.types';

interface Props {
  children: React.ReactNode;
  roles?:   UserRole[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user, isAuthenticated } = useAuthStore();
  if (!isAuthenticated)                          return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/"      replace />;
  return <>{children}</>;
}
