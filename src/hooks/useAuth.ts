import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Agent, UserRole } from '../types';
import apiClient from '../lib/api-client';

// Simple internal event bus so all useAuth consumers stay in sync
// This avoids needing a provider and ensures immediate cross-component updates

type AuthListener = (payload: {
  user?: User | Agent | null;
  isAuthenticated?: boolean;
  error?: string | null;
}) => void;

const authListeners = new Set<AuthListener>();

function subscribeAuth(listener: AuthListener) {
  authListeners.add(listener);
  return () => authListeners.delete(listener);
}

function emitAuth(payload: {
  user?: User | Agent | null;
  isAuthenticated?: boolean;
  error?: string | null;
}) {
  authListeners.forEach((listener) => {
    try {
      listener(payload);
    } catch {}
  });
}

export function useAuth() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | Agent | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = apiClient.getToken();

      if (token) {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData as User | Agent);
          setIsAuthenticated(true);
          emitAuth({ user: userData as User | Agent, isAuthenticated: true, error: null });
        } catch {
          apiClient.setToken(null);
          localStorage.removeItem('vilanow_user');
        }
      } else {
        const stored = localStorage.getItem('vilanow_user');
        if (stored) {
          try {
            const parsedUser = JSON.parse(stored);
            setUser(parsedUser);
            setIsAuthenticated(true);
            emitAuth({ user: parsedUser, isAuthenticated: true, error: null });
          } catch {
            localStorage.removeItem('vilanow_user');
          }
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Subscribe to global auth changes so all hook consumers stay in sync
  useEffect(() => {
    const unsubscribe = subscribeAuth(({ user, isAuthenticated, error }) => {
      if (user !== undefined) setUser(user as User | Agent | null);
      if (isAuthenticated !== undefined) setIsAuthenticated(!!isAuthenticated);
      if (error !== undefined) setError(error);
    });
    return unsubscribe;
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const login = async (email: string, password: string, _role?: UserRole) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.login(email, password);
      const userData = response.user;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('vilanow_user', JSON.stringify(userData));
      emitAuth({ user: userData, isAuthenticated: true, error: null });

      navigate('/dashboard'); // Redirect after login
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, role: UserRole, userData: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.register({
        email,
        password,
        name: userData.name,
        phone: userData.phone,
        role,
        agentType: userData.agentType,
      });

      // Ensure token is set immediately after signup if provided by API
      if ((response as any).token) {
        apiClient.setToken((response as any).token);
      }

      const newUser = response.user;
      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('vilanow_user', JSON.stringify(newUser));
      emitAuth({ user: newUser, isAuthenticated: true, error: null });

      navigate('/dashboard'); // Redirect after signup
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.requestPasswordReset(email);
    } catch {
      // ignore to avoid exposing if email exists
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await apiClient.resetPassword(token, newPassword);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch {
      // ignore
    }

    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('vilanow_user');
    emitAuth({ user: null, isAuthenticated: false, error: null });

    navigate('/login'); // Redirect after logout
  };

  const updateUser = async (updates: Partial<User | Agent>) => {
    if (!user) return;

    try {
      const updatedUser = await apiClient.updateUser(user.id, updates);
      const mergedUser = { ...user, ...updatedUser };
      setUser(mergedUser as User | Agent);
      localStorage.setItem('vilanow_user', JSON.stringify(mergedUser));
      emitAuth({ user: mergedUser as User | Agent });
    } catch (err: any) {
      console.error('Failed to update user:', err);
      const updated = { ...user, ...updates };
      setUser(updated as User | Agent);
      localStorage.setItem('vilanow_user', JSON.stringify(updated));
      emitAuth({ user: updated as User | Agent });
    }
  };

  const isAgent = user?.role === 'agent';
  const needsKYC = isAgent && (user as Agent).kycStatus === 'unverified';

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    clearError,
    login,
    signup,
    logout,
    updateUser,
    sendPasswordReset,
    resetPassword,
    isAgent,
    isSeeker: user?.role === 'seeker',
    needsKYC,
  };
}
