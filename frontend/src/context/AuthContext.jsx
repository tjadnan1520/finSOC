import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/auth.service';
import { setToken, getToken, removeToken, setUser, getUser, clearSession } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [token, setTokenState] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    const savedToken = getToken();
    const savedUser = getUser();

    if (!savedToken || !savedUser) {
      setLoading(false);
      return;
    }

    setTokenState(savedToken);
    setUserState(savedUser);

    try {
      const { data } = await authService.getCurrentUser();
      setUserState(data);
      setUser(data);
      setIsAuthenticated(true);
    } catch {
      clearSession();
      setTokenState(null);
      setUserState(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (email, password) => {
    const { data } = await authService.login(email, password);
    const { token: newToken, user: newUser } = data;

    setToken(newToken);
    setUser(newUser);
    setTokenState(newToken);
    setUserState(newUser);
    setIsAuthenticated(true);

    return data;
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setTokenState(null);
    setUserState(null);
    setIsAuthenticated(false);
    window.location.href = '/login';
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { data } = await authService.getCurrentUser();
      setUserState(data);
      setUser(data);
    } catch {
      logout();
    }
  }, [logout]);

  const value = {
    user,
    role: user?.role || null,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export default AuthContext;
