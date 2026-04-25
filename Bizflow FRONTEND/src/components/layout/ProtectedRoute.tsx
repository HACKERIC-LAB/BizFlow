import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types/user';
import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to their default dashboard if they don't have access
    const defaultPaths: Record<UserRole, string> = {
      OWNER: '/dashboard',
      MANAGER: '/dashboard',
      STAFF: '/queue',
      VIEWER: '/dashboard-viewer',
    };
    return <Navigate to={defaultPaths[user.role]} replace />;
  }

  return children;
};
