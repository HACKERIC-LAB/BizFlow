import { useAuthStore } from '../store/authStore';

export const useAuth = () => {
  const { user, isAuthenticated, accessToken, login, logout } = useAuthStore();

  const hasRole = (roles: string[]) => {
    return user ? roles.includes(user.role) : false;
  };

  return {
    user,
    isAuthenticated,
    accessToken,
    login,
    logout,
    hasRole,
  };
};
