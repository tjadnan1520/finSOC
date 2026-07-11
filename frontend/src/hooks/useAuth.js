import { useAuth as useAuthContext } from '../context/AuthContext';

export default function useAuth() {
  const { user, role, token, isAuthenticated, loading, login, logout, refreshUser } =
    useAuthContext();

  return { user, role, token, isAuthenticated, loading, login, logout, refreshUser };
}
