import { createContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { AuthUser, AuthCredentials, SignupData } from '../types/authTypes';
import * as authAPI from '../services/authAPI';
import { useToast } from '@/shared/components/Toast/ToastContext';

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (creds: AuthCredentials) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const session = authAPI.getSession();
    setUser(session);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (creds: AuthCredentials) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await authAPI.login(creds);
      if (result.success && result.user) {
        setUser(result.user);
        showToast('Successfully logged in', 'success');
      } else {
        const errorMsg = result.error ?? 'Login failed';
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const signup = useCallback(async (data: SignupData) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await authAPI.signup(data);
      if (result.success && result.user) {
        setUser(result.user);
        showToast('Account created successfully', 'success');
      } else {
        const errorMsg = result.error ?? 'Signup failed';
        setError(errorMsg);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  const logout = useCallback(() => {
    authAPI.clearSession();
    setUser(null);
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        signup,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
